import z from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import { WebError } from "@deepseek-ai/dsh-web";

/** Stable id this provider registers under. */
const KAGI_PROVIDER_ID = "kagi";
/** Default base URL: Kagi Search API v1. */
const KAGI_DEFAULT_BASE_URL = "https://kagi.com/api/v1";
/** Fallback result limit when the tool passes no `maxResults`. */
const KAGI_DEFAULT_LIMIT = 10;
/** Kagi caps a single search at 1024 results. */
const KAGI_MAX_LIMIT = 1024;
/** Credential reference the provider reads the API key from. */
const DEFAULT_API_KEY_ENV = "KAGI_SEARCH_API_KEY";

/**
 * Map a Kagi Search v1 response to the normalized web-search result. The
 * `data.search[]` array carries the citeable web pages; Kagi's `time` maps to
 * `publishedAt`. The web service owns the final `maxResults` truncation, so
 * `truncated` is always `false` here.
 * @param response - the parsed `/search` response body.
 * @returns the normalized result.
 */
function mapKagiResponse(response) {
  const items = Array.isArray(response?.data?.search) ? response.data.search : [];
  const sources = [];
  for (const item of items) {
    if (typeof item?.url !== "string" || item.url.length === 0) continue;
    sources.push({
      url: item.url,
      ...(typeof item.title === "string" && item.title.length > 0 ? { title: item.title } : {}),
      ...(typeof item.snippet === "string" && item.snippet.length > 0 ? { snippet: item.snippet } : {}),
      ...(typeof item.time === "string" && item.time.length > 0 ? { publishedAt: item.time } : {}),
    });
  }
  return { sources, truncated: false };
}

/**
 * The Kagi-backed search provider. HTTP redirects fail as `WEB_PROVIDER_ERROR`
 * rather than being followed, so a search can never silently leave the
 * configured base.
 */
class KagiSearchProvider {
  resolveOptions;
  id = KAGI_PROVIDER_ID;

  /**
   * @param resolveOptions - thunk returning the options for the NEXT operation,
   * snapshotted once at entry so one search never mixes two settings sections.
   */
  constructor(resolveOptions) {
    this.resolveOptions = resolveOptions;
  }

  available() {
    const options = this.resolveOptions();
    return (
      URL.canParse(options.baseURL) &&
      isPositiveInteger(options.limit) &&
      options.limit <= KAGI_MAX_LIMIT
    );
  }

  async search(request, signal) {
    const options = this.resolveOptions();
    const apiKey = await this.apiKey(options, signal);
    throwIfSearchAborted(signal);
    const endpoint = `${options.baseURL}/search`;
    const body = {
      query: request.query,
      limit: clampLimit(request.maxResults ?? options.limit),
      ...(options.safeSearch ? { safe_search: true } : {}),
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        redirect: "error",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
        ...(signal !== undefined ? { signal } : {}),
      });
    } catch (error) {
      if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
      throw new WebError(`Kagi search request failed: ${String(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
    }
    if (!response.ok) {
      let message = `Kagi API error (HTTP ${response.status})`;
      try {
        const parsed = await response.json();
        const errors = Array.isArray(parsed.error) ? parsed.error : [];
        const detail = errors[0]?.message ?? (typeof parsed.error === "string" ? parsed.error : undefined);
        if (detail !== undefined && detail.length > 0) message = detail;
      } catch (error) {
        if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
      }
      throw new WebError(message, "WEB_PROVIDER_ERROR");
    }
    try {
      return mapKagiResponse(await response.json());
    } catch (error) {
      if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
      if (error instanceof WebError) throw error;
      throw new WebError(`Kagi returned an unprocessable response body: ${String(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
    }
  }

  /**
   * Resolve one operation's credential without retaining it on the provider.
   * @param options - the caller's snapshot, so the key and the endpoint it is
   * sent to come from one section.
   * @param signal - abort signal for the surrounding search.
   * @returns the resolved key.
   */
  async apiKey(options, signal) {
    throwIfSearchAborted(signal);
    let resolved;
    try {
      resolved = await abortable(options.resolveApiKey?.() ?? Promise.resolve(undefined), signal);
    } catch (error) {
      if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
      throw new WebError(`Kagi search credential resolution failed: ${String(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
    }
    if (resolved !== undefined && resolved.length > 0) return resolved;
    throw new WebError(
      `Kagi search has no API key for "${DEFAULT_API_KEY_ENV}"; store it in the credentials service`,
      "WEB_PROVIDER_CREDENTIAL_MISSING",
    );
  }
}

/**
 * Race a same-process asynchronous preflight against caller cancellation. The
 * attached settlement handlers keep observing an uncooperative operation after
 * abort so a later rejection cannot become unhandled.
 */
function abortable(operation, signal) {
  if (signal === undefined) return operation;
  if (signal.aborted) return Promise.reject(searchAborted(signal));
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      reject(searchAborted(signal));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    operation.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(new Error(String(error).replace(/^Error: /u, ""), { cause: error }));
      },
    );
  });
}

/** Throw the provider's stable cancellation error when the caller already aborted. */
function throwIfSearchAborted(signal) {
  if (signal?.aborted === true) throw searchAborted(signal);
}

/** Build the provider's stable cancellation error while retaining the caller's reason. */
function searchAborted(signal, fallback) {
  return new WebError("Kagi search aborted", "WEB_ABORTED", { cause: signal?.aborted === true ? signal.reason : fallback });
}

/** True for a fetch/`AbortSignal` abort, reported as `WEB_ABORTED`. */
function isAbortError(error) {
  return error instanceof DOMException && error.name === "AbortError";
}

/** True for request limits that can be sent to the Search API. */
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/** Clamp a result limit to Kagi's 1 to 1024 contract. */
function clampLimit(value) {
  return Math.min(Math.max(Math.trunc(value), 1), KAGI_MAX_LIMIT);
}

/** Cordis plugin name used by loader diagnostics. */
const name = "web-search-kagi";
/** The web seam this provider registers into. */
const inject = ["web"];
/** Settings namespace carrying this provider's key and limits. */
const WEB_SEARCH_KAGI_SETTINGS_NAMESPACE = settingsNamespace("web-search-kagi");

/** Plugin config; every field is optional and fully defaulted in `resolveOptions`. */
const Config = z.object({
  baseURL: z.string().default(KAGI_DEFAULT_BASE_URL),
  limit: z.number().step(1).min(1).max(KAGI_MAX_LIMIT).default(KAGI_DEFAULT_LIMIT),
  safeSearch: z.boolean().default(true),
});

/**
 * Project one resolved section into the options the provider serves its next
 * search with. Every value it reads is already fully defaulted.
 * @param ctx - plugin context supplying the credentials service.
 * @param config - the currently authoritative section.
 * @returns options for one search.
 */
function resolveOptions(ctx, config) {
  const apiKeyRef = credentialRef(DEFAULT_API_KEY_ENV);
  return {
    resolveApiKey: async () => {
      const credentials = ctx.get("credentials");
      if (credentials !== undefined) return (await credentials.resolve(apiKeyRef))?.value;
      return undefined;
    },
    baseURL: config.baseURL ?? KAGI_DEFAULT_BASE_URL,
    limit: config.limit ?? KAGI_DEFAULT_LIMIT,
    safeSearch: config.safeSearch ?? true,
  };
}

/** Register the Kagi search provider with `ctx.web`. */
function apply(ctx, config) {
  let current = () => config;
  installSettingsSection(ctx, WEB_SEARCH_KAGI_SETTINGS_NAMESPACE, Config, config, {
    setSource: (source) => {
      current = source;
    },
    onChange: () => {},
  });
  ctx.web.registerSearchProvider(new KagiSearchProvider(() => resolveOptions(ctx, current())));
}

export {
  Config,
  KAGI_DEFAULT_BASE_URL,
  KAGI_DEFAULT_LIMIT,
  KAGI_MAX_LIMIT,
  KAGI_PROVIDER_ID,
  KagiSearchProvider,
  WEB_SEARCH_KAGI_SETTINGS_NAMESPACE,
  apply,
  inject,
  name,
};

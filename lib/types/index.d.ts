/**
 * Register a Kagi Search v1-backed provider in `ctx.web`. It POSTs to the Kagi
 * `/search` endpoint with bearer auth and maps `data.search[]` onto the seam's
 * portable citation shape.
 * @module @deepseek-ai/dsh-web-search-kagi
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings';
import type { WebSearchProvider } from '@deepseek-ai/dsh-web';

export { KAGI_DEFAULT_BASE_URL, KAGI_DEFAULT_LIMIT, KAGI_MAX_LIMIT, KAGI_PROVIDER_ID, KagiSearchProvider };

/** Stable id this provider registers under. */
export declare const KAGI_PROVIDER_ID: string;
/** Default base URL: Kagi Search API v1. */
export declare const KAGI_DEFAULT_BASE_URL: string;
/** Fallback result limit when the tool passes no `maxResults`. */
export declare const KAGI_DEFAULT_LIMIT: number;
/** Kagi caps a single search at 1024 results. */
export declare const KAGI_MAX_LIMIT: number;

/** The Kagi-backed search provider. */
export declare class KagiSearchProvider implements WebSearchProvider {
  readonly id: string;
  constructor(resolveOptions: () => KagiSearchProviderOptions);
  available(): boolean;
  search(request: { query: string; maxResults?: number }, signal?: AbortSignal): Promise<import('@deepseek-ai/dsh-web').WebSearchResult>;
}

/** Options snapshotted for one search. */
export interface KagiSearchProviderOptions {
  apiKey?: string;
  resolveApiKey?: () => Promise<string | undefined>;
  apiKeyEnv?: string;
  baseURL: string;
  limit: number;
  safeSearch: boolean;
}

/** Cordis plugin name used by loader diagnostics. */
export declare const name = 'web-search-kagi';
/** The web seam this provider registers into. */
export declare const inject: string[];

/** Plugin config; every field is optional and fully defaulted in `apply`. */
export interface Config {
  /** Literal Kagi API key; prefer {@link apiKeyEnv} so no secret enters configuration files. */
  apiKey?: string;
  /** Credential reference resolved for each search; defaults to `KAGI_API_KEY`. */
  apiKeyEnv?: string;
  /** Kagi Search API v1 base URL. Defaults to `https://kagi.com/api/v1`. */
  baseURL?: string;
  /** Fallback result limit when the tool passes no `maxResults`; 1–1024. Defaults to 10. */
  limit?: number;
  /** Whether to request Kagi safe search. Defaults to `true`. */
  safeSearch?: boolean;
}
export declare const Config: z<Config>;
/** Settings namespace carrying this provider's key reference and limits. */
export declare const WEB_SEARCH_KAGI_SETTINGS_NAMESPACE: SettingsNamespace;
/** Register the Kagi search provider with `ctx.web`. */
export declare function apply(ctx: Context, config: Config): void;

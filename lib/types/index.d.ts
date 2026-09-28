/**
 * Register a Kagi Search v1-backed provider in `ctx.web`. It POSTs to the Kagi
 * `/search` endpoint with bearer auth and maps `data.search[]` onto the seam's
 * portable citation shape.
 * @module dsh-web-search-kagi
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
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
  resolveApiKey?: () => Promise<string | undefined>;
  baseURL: string;
  limit: number;
  safeSearch: boolean;
}

/** Cordis plugin name used by loader diagnostics. */
export declare const name = 'web-search-kagi';
/** The web seam this provider registers into. */
export declare const inject: string[];

/** Plugin config. Every field is `.volatile()`, so each is editable in the settings page. */
export interface Config {
  /** Kagi Search API v1 base URL. Defaults to `https://kagi.com/api/v1`. */
  baseURL?: string;
  /** Fallback result limit when the tool passes no `maxResults`; 1 to 1024. Defaults to 10. */
  limit?: number;
  /** Whether to request Kagi safe search. Defaults to `true`. */
  safeSearch?: boolean;
  /**
   * Write-only Kagi API key. The settings page collects it, the plugin stores it
   * in the credentials service under `KAGI_SEARCH_API_KEY`, and the field is
   * cleared again so it is never configuration.
   */
  apiKey?: string;
}
export declare const Config: z<Config>;
/** Register the Kagi search provider with `ctx.web`. */
export declare function apply(ctx: Context, config: Config): void;

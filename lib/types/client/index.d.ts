/**
 * Browser half of the Kagi search provider: one card in Settings → Plugins →
 * "Plugin configuration", keyed on the `web-search-kagi` settings namespace.
 * @module @deepseek-ai/dsh-web-search-kagi/client
 */
import type { Context } from '@deepseek-ai/cordis';

/** Client services this bundle injects. */
export declare const inject: string[];
/** Register the Kagi settings card under the `settings.plugin.item` slot. */
export declare function apply(ctx: Context): void;

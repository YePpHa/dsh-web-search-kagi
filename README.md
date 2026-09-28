# dsh-web-search-kagi

Kagi Search v1 provider for the DeepSeek Harness web capability seam (`ctx.web`).

Published on npm as [`dsh-web-search-kagi`](https://www.npmjs.com/package/dsh-web-search-kagi).

Registers a `WebSearchProvider` with id `kagi` that POSTs to Kagi's
`https://kagi.com/api/v1/search` with bearer auth and maps `data.search[]` onto
the seam's portable citation shape (`url`, `title`, `snippet`, `publishedAt`).

## Install

Add the package to the profile that runs the web app:

```sh
dsh plugin --profile web add dsh-web-search-kagi
```

This writes `dsh-web-search-kagi` to the profile's `package.json` and installs
it. Without the `dsh` CLI, run `pnpm add dsh-web-search-kagi` from the profile
directory instead.

Then compose it in `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- id: web
  config:
    searchProvider: kagi

- id: web-search-deepseek
  disabled: true
```

Restart the harness.

## Bundle layer

The package declares `dsh.bundle.patch` in `package.json` and ships
`cordis.patch.yml` at its root: it is a dsh bundle, not just a plugin package.
`dsh plugin --profile web add dsh-web-search-kagi` therefore also appends the
package to `dsh.profile.bundles`, and that layer inserts the `web-search-kagi`
provider row, so the profile patch above needs no `insert` entry of its own.

Which provider the web seam serves is deployment configuration and stays in the
profile patch above: bundle layers are applied before it, so its
`searchProvider: kagi` wins over both the bundle row and the base layer's
`searchProvider: deepseek-official`.

Upgrading from 0.2.x: delete the `- insert:` block from the profile patch. The
bundle contributes `web-search-kagi` now, and two loader entries sharing one id
fail the boot with `duplicate loader entry id: web-search-kagi`. The `web` and
`web-search-deepseek` patches stay.

## API key

The provider reads the key from the credentials service under the `KAGI_SEARCH_API_KEY`
reference. Put it in `$DSH_HOME/.credentials.yaml`:

```yaml
KAGI_SEARCH_API_KEY: your-kagi-api-key
```

You can also set it later in the web UI at Settings → Plugins → Plugin
configuration, whose **API key** field writes the same credential. Get a key from
[Kagi](https://kagi.com).

## Config

| Field | Default | Notes |
| --- | --- | --- |
| `baseURL` | `https://kagi.com/api/v1` | Kagi Search API v1 base. |
| `limit` | `10` | Fallback result limit, 1 to 1024. |
| `safeSearch` | `true` | Requests Kagi `safe_search`. |
| `apiKey` | unset | Write-only; moved into the credentials service (see below). |

Every field is marked `.volatile()`, which is what makes it editable in the
settings page without restarting the plugin.

## Settings UI

The plugin's settings show in the web UI at Settings → Plugins → Plugin
configuration. No `cordis.patch.yml` edit is needed to change these values after
install, and the package ships **no browser bundle**: DeepSeek Harness generates
the page from the plugin's `Config` schema.

Every write carries the revision it read, and overridden fields show a Reset to
default button. The layering is schema defaults, then the composition entry
config, then the user document, so the `config:` block in `cordis.patch.yml`
stays the deployment's base layer.

### The API key field

`apiKey` is a `role('secret')` field, so the settings wire redacts it. It is not
configuration: when the form supplies a value the plugin writes it to the
credentials service under `KAGI_SEARCH_API_KEY` and clears the field, so later
settings writes do not restate it.

Prefer `$DSH_HOME/.credentials.yaml` if you want the secret to never pass through
a settings form. That path writes the value nowhere but the credentials store;
the form has to accept the value before the plugin can redirect it, so a key
typed into the page does reach the profile patch and the settings document when
the form writes them.

The provider re-resolves the credential on every operation, so a key changed in
either place reaches the next search with no restart.

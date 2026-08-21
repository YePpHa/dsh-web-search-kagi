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
- insert:
    - id: web-search-kagi
      name: 'dsh-web-search-kagi'

- id: web
  config:
    searchProvider: kagi

- id: web-search-deepseek
  disabled: true
```

Restart the harness.

## API key

The provider reads the key from the credentials service under the `KAGI_SEARCH_API_KEY`
reference. Put it in `$DSH_HOME/.credentials.yaml`:

```yaml
KAGI_SEARCH_API_KEY: your-kagi-api-key
```

You can also set it later in the web UI at Settings → Plugins → Plugin
configuration; the card writes the same credential. Get a key from
[Kagi](https://kagi.com).

## Config

All fields optional:

| Field | Default | Notes |
| --- | --- | --- |
| `baseURL` | `https://kagi.com/api/v1` | Kagi Search API v1 base. |
| `limit` | `10` | Fallback result limit, 1 to 1024. |
| `safeSearch` | `true` | Requests Kagi `safe_search`. |

## Settings UI

Since DeepSeek Harness v0.1.0-rc.7 the plugin's settings show in the web UI at
Settings → Plugins → Plugin configuration. The package registers the
`web-search-kagi` settings namespace on the Host (`installSettingsSection`) and
ships a `dsh.client` browser bundle (`lib/client.js`) that renders a card for
it. No `cordis.patch.yml` edit is needed to change these values after install.

The card edits the API key, the endpoint (`baseURL`), the result limit
(`limit`), and the safe search toggle (`safeSearch`). The key field writes the
`KAGI_SEARCH_API_KEY` credential and never shows the stored value; leave it blank to
keep the current key.

Edits are held until you press Save. Each write carries the revision it read,
and overridden fields show a Reset to default button. The layering is unchanged:
schema defaults, then the composition entry config, then the user document. The
`config:` block in `cordis.patch.yml` stays the deployment's base layer.

`Config` in `lib/index.js` and the card's field list describe the same fields.
The card mirrors the schema defaults for reset previews, so keep them in sync
when you add or change a field.

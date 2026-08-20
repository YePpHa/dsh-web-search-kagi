# dsh-web-search-kagi

Kagi Search v1 provider for the DeepSeek Harness web capability seam (`ctx.web`).

Registers a `WebSearchProvider` with id `kagi` that POSTs to Kagi's
`https://kagi.com/api/v1/search` with bearer auth, and maps `data.search[]`
onto the seam's portable citation shape (`url`, `title`, `snippet`,
`publishedAt`).

## Install

The package is a plain Cordis plugin (no `dsh.bundle`), so it is installed as a
profile dependency and composed through the profile's `cordis.patch.yml`:

```sh
# from the profile directory, or via `dsh plugin --profile web add <path>`
```

Then in `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: web-search-kagi
      name: 'dsh-web-search-kagi'
      config:
        apiKeyEnv: KAGI_API_KEY

- id: web
  config:
    searchProvider: kagi

- id: web-search-deepseek
  disabled: true
```

## Credentials

The key resolves through the credentials service, so `KAGI_API_KEY` can live in
`$DSH_HOME/.credentials.yaml` or the launching environment. A literal
`apiKey` under the `web-search-kagi:` settings section also works.

## Config

All fields optional:

| Field | Default | Notes |
| --- | --- | --- |
| `apiKey` | — | Literal key (secret role). |
| `apiKeyEnv` | `KAGI_API_KEY` | Credential reference resolved per search. |
| `baseURL` | `https://kagi.com/api/v1` | Kagi Search API v1 base. |
| `limit` | `10` | Fallback result limit, 1–1024. |
| `safeSearch` | `true` | Requests Kagi `safe_search`. |

## Settings UI

Since DeepSeek Harness v0.1.0-rc.7 the plugin's settings appear in the web UI
under **Settings → Plugins → Plugin configuration**. The package registers the
`web-search-kagi` settings namespace on the Host (`installSettingsSection`) and
ships a `dsh.client` browser bundle (`lib/client.js`) that renders a card for
it, so no `cordis.patch.yml` edit is required to change these values after
install:

- **API key** — written through the credentials domain (never into the settings
  file), addressed by the current API-key reference. Blank keeps the stored key.
- **API key reference** — the `apiKeyEnv` credential reference.
- **Endpoint** — the `baseURL` the provider posts to.
- **Result limit** — the fallback `limit`.
- **Safe search** — the `safeSearch` toggle.

The card stages edits and writes them on **Save**, fences each write with the
settings revision it read, and marks every field the user overrode with a
**Reset to default**. The values remain layered exactly as before: schema
defaults, then the composition entry config, then the user document, so the
`config:` block in `cordis.patch.yml` still works as the deployment's `base`
layer.

The Host schema (`Config` in `lib/index.js`) and the card's field list are the
same surface; the card mirrors the schema defaults for reset previews, so keep
the two in sync when adding or changing a field.

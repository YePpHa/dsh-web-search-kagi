/**
 * Browser half of the Kagi search provider: one card in the Settings → Plugins →
 * "Plugin configuration" tab, keyed on the `web-search-kagi` settings namespace.
 *
 * This file is a `dsh.client` bundle. It is a plain classic script executed by
 * the client module system: executing it only REGISTERS the factory below, and
 * every side effect (React render, CSS injection) runs inside the factory
 * closure at first materialization. It must not use `import`/`export`/JSX; the
 * only reachable modules are the platform seed (`react`) and the client runtime
 * (`@deepseek-ai/dsh-client-runtime/client`). Cordis services arrive through
 * the injected context, not through `require`.
 */
window.__ModuleLoader__.load({
  id: "dsh-web-search-kagi",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");
    let { createSnapshotStore } = require("@deepseek-ai/dsh-client-runtime/client");

    //#region css
    const cssText = ".dshKagi_field{flex-direction:column;gap:6px;padding:12px 0;display:flex}.dshKagi_field+.dshKagi_field{border-top:1px solid var(--dsw-alias-border-l2)}.dshKagi_head{align-items:center;gap:8px;display:flex}.dshKagi_label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}.dshKagi_badges{align-items:center;gap:8px;display:inline-flex}.dshKagi_badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.dshKagi_badgeMuted{white-space:nowrap;color:var(--dsw-alias-label-tertiary);border-radius:999px;padding:1px 8px;font-size:11px;line-height:17px}.dshKagi_reset{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;padding:0;font-size:12px;line-height:1.5}.dshKagi_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.dshKagi_reset:disabled{cursor:default}.dshKagi_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.dshKagi_input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.dshKagi_input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.dshKagi_inputInvalid{border-color:var(--dsw-alias-label-error)}.dshKagi_invalid{color:var(--dsw-alias-label-error);margin:0;font-size:12px;line-height:1.5}.dshKagi_hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}.dshKagi_check{align-items:center;gap:8px;color:var(--dsw-alias-label-primary);display:flex;font-size:13px;line-height:1.5}.dshKagi_check input{accent-color:var(--dsw-alias-brand-primary);margin:0}.dshKagi_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}.dshKagi_card:hover{border-color:var(--dsw-alias-label-dimmed)}.dshKagi_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.dshKagi_header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}.dshKagi_header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}.dshKagi_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.dshKagi_name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}.dshKagi_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.dshKagi_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.dshKagi_chevronOpen{color:var(--dsw-alias-label-tertiary);flex:none;transform:rotate(180deg);transition:transform .16s}.dshKagi_pending{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.dshKagi_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}.dshKagi_readOnly{color:var(--dsw-alias-label-tertiary);margin:12px 0 0;font-size:12px;line-height:1.5}.dshKagi_footer{border-top:1px solid var(--dsw-alias-border-l2);justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px;display:flex}.dshKagi_failed{min-width:0;color:var(--dsw-alias-label-error);flex:1;margin:0;font-size:12px;line-height:1.5}.dshKagi_discard,.dshKagi_save{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}.dshKagi_discard{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.dshKagi_save{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-on-solid)}.dshKagi_discard:disabled,.dshKagi_save:disabled{cursor:default;opacity:.5}";
    const cssTag = "dsh-web-search-kagi/kagi-card.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(cssTag) + "]") === null) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-web-search-kagi";
      tag.dataset.pluginCss = cssTag;
      tag.textContent = cssText;
      document.head.appendChild(tag);
    }
    const css = {
      field: "dshKagi_field",
      head: "dshKagi_head",
      label: "dshKagi_label",
      badges: "dshKagi_badges",
      badge: "dshKagi_badge",
      badgeMuted: "dshKagi_badgeMuted",
      reset: "dshKagi_reset",
      input: "dshKagi_input",
      inputInvalid: "dshKagi_inputInvalid",
      invalid: "dshKagi_invalid",
      hint: "dshKagi_hint",
      check: "dshKagi_check",
      card: "dshKagi_card",
      cardOpen: "dshKagi_cardOpen",
      header: "dshKagi_header",
      headText: "dshKagi_headText",
      name: "dshKagi_name",
      description: "dshKagi_description",
      chevron: "dshKagi_chevron",
      chevronOpen: "dshKagi_chevronOpen",
      pending: "dshKagi_pending",
      body: "dshKagi_body",
      readOnly: "dshKagi_readOnly",
      footer: "dshKagi_footer",
      failed: "dshKagi_failed",
      discard: "dshKagi_discard",
      save: "dshKagi_save",
    };
    //#endregion

    //#region form model
    /** Settings namespace this card edits (mirrors the Host plugin's registration). */
    const KAGI_NS = "web-search-kagi";
    /** Credential reference the provider resolves when the section names none. */
    const DEFAULT_API_KEY_REF = "KAGI_API_KEY";
    /** Form field the write-only credential control stages under. */
    const API_KEY_FIELD = "apiKey";
    /** Schema defaults mirrored from the Host Config (used for reset previews). */
    const DEFAULTS = {
      apiKeyEnv: "KAGI_API_KEY",
      baseURL: "https://kagi.com/api/v1",
      limit: 10,
      safeSearch: true,
    };

    /** Free-text field; an empty draft clears the override. */
    function textField(field) {
      return {
        field,
        kind: "text",
        format: (value) => typeof value === "string" ? value : "",
        parse: (text) => {
          const trimmed = text.trim();
          return trimmed === "" ? { op: "clear" } : { op: "set", value: trimmed };
        },
      };
    }

    /** Whole-number field; an empty draft clears the override. */
    function numberField(field) {
      return {
        field,
        kind: "number",
        format: (value) => typeof value === "number" ? String(value) : "",
        parse: (text) => {
          const trimmed = text.trim();
          if (trimmed === "") return { op: "clear" };
          const parsed = Number(trimmed);
          return Number.isFinite(parsed) ? { op: "set", value: parsed } : undefined;
        },
      };
    }

    /** Boolean field; the checkbox stages a set, reset stages a clear. */
    function booleanField(field) {
      return { field, kind: "boolean", format: (value) => value === true };
    }

    /**
     * One card's staged form over the `web-search-kagi` settings scope. A field
     * stages what the user types and writes it only on save; the Host stays the
     * only authority on whether a value was accepted, so the outcome is read back.
     */
    class KagiCardForm {
      constructor(scope, specs, secrets) {
        this.scope = scope;
        this.specs = new Map(specs.map((spec) => [spec.field, spec]));
        this.secrets = new Map((secrets ?? []).map((spec) => [spec.field, spec]));
        this.staged = new Map();
        this.listeners = new Set();
        this.saving = false;
        this.failed = false;
        scope.subscribe(() => this.publish());
      }

      bind(project) {
        const store = createSnapshotStore(project());
        this.listeners.add(() => store.set(project()));
        return store;
      }

      snapshot() {
        return this.scope.getSnapshot();
      }
      value(field) {
        return this.snapshot().value?.[field];
      }
      base(field) {
        return this.snapshot().base?.[field];
      }
      userLayer() {
        return this.snapshot().user;
      }
      overridden(field) {
        const user = this.userLayer();
        return user !== undefined && Object.hasOwn(user, field);
      }

      shell() {
        const snap = this.snapshot();
        const plan = this.plan();
        return {
          available: snap.status === "ready",
          writable: snap.writable,
          dirty: this.staged.size > 0,
          invalid: plan.some((item) => item.run === undefined),
          saving: this.saving,
          failed: this.failed,
        };
      }

      /** Read one section field's control state. */
      field(field) {
        const spec = this.spec(field);
        const staged = this.staged.get(field);
        if (spec.kind === "boolean") {
          const checked = staged === undefined
            ? this.value(field) === true
            : staged.op === "clear" ? (this.base(field) ?? DEFAULTS[field]) === true : staged.value === true;
          return {
            checked,
            overridden: staged === undefined ? this.overridden(field) : staged.op === "set",
          };
        }
        if (staged === undefined) {
          return {
            text: spec.format(this.value(field)),
            overridden: this.overridden(field),
            invalid: false,
          };
        }
        if (staged.op === "clear") {
          return {
            text: spec.format(this.base(field) ?? DEFAULTS[field]),
            overridden: false,
            invalid: false,
          };
        }
        const parsed = spec.parse(staged.value);
        return {
          text: staged.value,
          overridden: parsed?.op === "set",
          invalid: parsed === undefined,
        };
      }

      /** Read a write-only credential control's staged text. */
      secretField(field) {
        const staged = this.staged.get(field);
        return { text: staged?.value ?? "", invalid: false };
      }

      /** Every staged edit a save would write, in staging order. */
      plan() {
        const plan = [];
        for (const [field, staged] of this.staged) {
          const secret = this.secrets.get(field);
          if (secret !== undefined) {
            const value = String(staged.value ?? "").trim();
            if (value !== "") plan.push({ field, run: () => secret.write(value) });
            continue;
          }
          const spec = this.spec(field);
          if (spec.kind === "boolean") {
            if (staged.op === "clear") {
              if (this.overridden(field)) plan.push({ field, run: () => this.clear(field) });
            } else if (staged.value !== this.value(field)) {
              plan.push({ field, run: () => this.set(field, staged.value) });
            }
            continue;
          }
          if (staged.op === "clear") {
            if (this.overridden(field)) plan.push({ field, run: () => this.clear(field) });
            continue;
          }
          if (staged.value === spec.format(this.value(field))) continue;
          const parsed = spec.parse(staged.value);
          if (parsed === undefined) plan.push({ field, run: undefined });
          else if (parsed.op === "clear") plan.push({ field, run: () => this.clear(field) });
          else plan.push({ field, run: () => this.set(field, parsed.value) });
        }
        return plan;
      }

      async set(field, value) {
        await this.scope.set(field, value);
        return this.userLayer()?.[field] === value;
      }
      async clear(field) {
        await this.scope.unset(field);
        return !this.overridden(field);
      }

      async save() {
        const plan = this.plan();
        const writes = plan.flatMap((item) => item.run === undefined ? [] : [item.run]);
        if (plan.length === 0 || this.saving || writes.length !== plan.length) return;
        this.saving = true;
        this.failed = false;
        this.publish();
        let landed = true;
        for (const write of writes) landed = await write() && landed;
        if (landed) this.staged.clear();
        this.saving = false;
        this.failed = !landed;
        this.publish();
      }

      discard() {
        if (this.staged.size === 0 && !this.failed) return;
        this.staged.clear();
        this.failed = false;
        this.publish();
      }

      edit(field, value) {
        this.stage(field, { op: "set", value });
      }
      toggle(field, checked) {
        this.stage(field, { op: "set", value: checked });
      }
      resetField(field) {
        this.stage(field, { op: "clear" });
      }
      stage(field, edit) {
        this.staged.set(field, edit);
        this.failed = false;
        this.publish();
      }
      spec(field) {
        const spec = this.specs.get(field);
        if (spec === undefined) throw new Error(`kagi card has no field ${field}`);
        return spec;
      }
      publish() {
        for (const listener of this.listeners) listener();
      }
      actions() {
        return {
          edit: (field, value) => this.edit(field, value),
          toggle: (field, checked) => this.toggle(field, checked),
          resetField: (field) => this.resetField(field),
          save: () => this.save(),
          discard: () => this.discard(),
        };
      }
    }
    //#endregion

    //#region card controller
    /**
     * Bridges the `web-search-kagi` scope and the credentials domain onto the
     * card. The API key is the one control that does not live in the section: its
     * literal never rides a response, so the card learns only whether one is
     * configured and writes it through the credentials domain, addressed by the
     * reference the section names.
     */
    class KagiCardController {
      constructor(scope, api) {
        this.scope = scope;
        this.api = api;
        this.form = new KagiCardForm(scope, [
          textField("apiKeyEnv"),
          textField("baseURL"),
          numberField("limit"),
          booleanField("safeSearch"),
        ], [{
          field: API_KEY_FIELD,
          write: (value) => this.writeKey(value),
        }]);
        this.store = this.form.bind(() => this.projection());
        this.credential = { ref: "", configured: false, writable: true };
        scope.subscribe(() => this.readCredential());
        this.readCredential();
      }

      projection() {
        return {
          ...this.form.shell(),
          apiKey: this.form.secretField(API_KEY_FIELD),
          apiKeyConfigured: this.credential.configured,
          apiKeyWritable: this.credential.writable,
          apiKeyEnv: this.form.field("apiKeyEnv"),
          baseURL: this.form.field("baseURL"),
          limit: this.form.field("limit"),
          safeSearch: this.form.field("safeSearch"),
        };
      }

      inject() {
        return {
          hooks: { kagiCard: this.store },
          ...this.form.actions(),
        };
      }

      /** The credential reference the section names, or the provider default. */
      refOf() {
        const declared = this.scope.getSnapshot().value?.apiKeyEnv;
        return declared !== undefined && declared.length > 0 ? declared : DEFAULT_API_KEY_REF;
      }

      async readCredential() {
        const ref = this.refOf();
        if (ref !== this.credential.ref) {
          this.credential = { ref, configured: false, writable: true };
          this.store.set(this.projection());
        }
        let response;
        try {
          response = await this.api.credentials.describe({ refs: [ref] });
        } catch (_credentialReadFailure) {
          return;
        }
        if (!response.result.ok || ref !== this.refOf()) return;
        const view = response.result.value.credentials[ref];
        const next = {
          ref,
          configured: view?.configured ?? false,
          writable: view?.writable ?? true,
        };
        if (next.configured === this.credential.configured && next.writable === this.credential.writable) return;
        this.credential = next;
        this.store.set(this.projection());
      }

      /** Re-read after the Host reports a change to the reference this card watches. */
      refreshCredential(ref) {
        if (ref !== this.credential.ref) return;
        this.readCredential();
      }

      async writeKey(value) {
        try {
          await this.api.credentials.set({ ref: this.refOf(), value });
        } catch (_credentialWriteFailure) {}
        await this.readCredential();
        return this.credential.configured;
      }
    }
    //#endregion

    //#region components
    function ValueField(props) {
      return react.createElement("div", { className: css.field },
        react.createElement("div", { className: css.head },
          react.createElement("label", { className: css.label, htmlFor: props.id }, props.label),
          props.overridden ? react.createElement("span", { className: css.badges },
            react.createElement("span", { className: css.badge }, props.overriddenLabel),
            react.createElement("button", { type: "button", className: css.reset, disabled: props.disabled, onClick: props.onReset }, props.resetLabel),
          ) : null,
        ),
        react.createElement("input", {
          id: props.id,
          className: props.invalid ? css.inputInvalid : css.input,
          type: "text",
          ...props.numeric === true ? { inputMode: "numeric" } : {},
          ...props.invalid ? { "aria-invalid": true } : {},
          value: props.text,
          placeholder: props.placeholder ?? "",
          disabled: props.disabled,
          onChange: (event) => props.onEdit(event.target.value),
        }),
        react.createElement("p", { className: props.invalid ? css.invalid : css.hint }, props.invalid ? props.invalidLabel : props.hint),
      );
    }

    function SecretField(props) {
      return react.createElement("div", { className: css.field },
        react.createElement("div", { className: css.head },
          react.createElement("label", { className: css.label, htmlFor: props.id }, props.label),
          react.createElement("span", { className: css.badges },
            react.createElement("span", { className: props.configured ? css.badge : css.badgeMuted }, props.stateLabel),
          ),
        ),
        react.createElement("input", {
          id: props.id,
          className: css.input,
          type: "password",
          autoComplete: "off",
          value: props.text,
          disabled: props.disabled,
          onChange: (event) => props.onEdit(event.target.value),
        }),
        react.createElement("p", { className: css.hint }, props.hint),
      );
    }

    function BooleanField(props) {
      return react.createElement("div", { className: css.field },
        react.createElement("div", { className: css.head },
          react.createElement("span", { className: css.label }, props.label),
          props.overridden ? react.createElement("span", { className: css.badges },
            react.createElement("span", { className: css.badge }, props.overriddenLabel),
            react.createElement("button", { type: "button", className: css.reset, disabled: props.disabled, onClick: props.onReset }, props.resetLabel),
          ) : null,
        ),
        react.createElement("label", { className: css.check },
          react.createElement("input", {
            type: "checkbox",
            checked: props.checked,
            disabled: props.disabled,
            onChange: (event) => props.onToggle(event.target.checked),
          }),
          react.createElement("span", null, props.checkLabel),
        ),
        react.createElement("p", { className: css.hint }, props.hint),
      );
    }

    function KagiCard(props) {
      const [open, setOpen] = react.useState(false);
      const state = props.useKagiCard((snapshot) => snapshot);
      if (!state.available) return null;
      const t = props.t;
      const blocked = !state.dirty || state.invalid || state.saving;
      return react.createElement("li", { className: open ? css.cardOpen : css.card },
        react.createElement("button", { type: "button", className: css.header, "aria-expanded": open, onClick: () => setOpen(!open) },
          react.createElement("span", { className: css.headText },
            react.createElement("span", { className: css.name }, t("kagiTitle")),
            react.createElement("span", { className: css.description }, t("kagiDescription")),
          ),
          state.dirty ? react.createElement("span", { className: css.pending }, t("unsaved")) : null,
          react.createElement("span", { className: open ? css.chevronOpen : css.chevron }, "▾"),
        ),
        open ? react.createElement("div", { className: css.body },
          !state.writable ? react.createElement("p", { className: css.readOnly, role: "status" }, t("readOnly")) : null,
          react.createElement(SecretField, {
            id: "kagi-config-key",
            label: t("kagiApiKey"),
            hint: t("kagiApiKeyHint"),
            disabled: !state.apiKeyWritable,
            text: state.apiKey.text,
            configured: state.apiKeyConfigured,
            stateLabel: state.apiKeyConfigured ? t("kagiApiKeySet") : t("kagiApiKeyUnset"),
            onEdit: (text) => props.edit(API_KEY_FIELD, text),
          }),
          react.createElement(ValueField, {
            id: "kagi-config-api-key-ref",
            label: t("kagiApiKeyEnv"),
            hint: t("kagiApiKeyEnvHint"),
            overriddenLabel: t("overridden"),
            resetLabel: t("reset"),
            invalidLabel: t("invalidNumber"),
            disabled: !state.writable,
            ...state.apiKeyEnv,
            onEdit: (text) => props.edit("apiKeyEnv", text),
            onReset: () => props.resetField("apiKeyEnv"),
          }),
          react.createElement(ValueField, {
            id: "kagi-config-endpoint",
            label: t("kagiBaseUrl"),
            hint: t("kagiBaseUrlHint"),
            overriddenLabel: t("overridden"),
            resetLabel: t("reset"),
            invalidLabel: t("invalidNumber"),
            disabled: !state.writable,
            ...state.baseURL,
            onEdit: (text) => props.edit("baseURL", text),
            onReset: () => props.resetField("baseURL"),
          }),
          react.createElement(ValueField, {
            id: "kagi-config-limit",
            label: t("kagiLimit"),
            hint: t("kagiLimitHint"),
            overriddenLabel: t("overridden"),
            resetLabel: t("reset"),
            invalidLabel: t("invalidNumber"),
            numeric: true,
            disabled: !state.writable,
            ...state.limit,
            onEdit: (text) => props.edit("limit", text),
            onReset: () => props.resetField("limit"),
          }),
          react.createElement(BooleanField, {
            label: t("kagiSafeSearch"),
            hint: t("kagiSafeSearchHint"),
            checkLabel: t("kagiSafeSearchCheck"),
            overriddenLabel: t("overridden"),
            resetLabel: t("reset"),
            disabled: !state.writable,
            ...state.safeSearch,
            onToggle: (checked) => props.toggle("safeSearch", checked),
            onReset: () => props.resetField("safeSearch"),
          }),
          react.createElement("div", { className: css.footer },
            state.failed ? react.createElement("p", { className: css.failed, role: "status" }, t("saveFailed")) : null,
            react.createElement("button", { type: "button", className: css.discard, disabled: !state.dirty || state.saving, onClick: props.discard }, t("discard")),
            react.createElement("button", { type: "button", className: css.save, disabled: blocked, onClick: props.save }, t(state.saving ? "saving" : "save")),
          ),
        ) : null,
      );
    }
    //#endregion

    //#region locale
    const NS = "settings.web-search-kagi";
    const en = {
      kagiTitle: "Kagi search",
      kagiDescription: "The Kagi Search provider.",
      kagiApiKey: "API key",
      kagiApiKeyHint: "Stored outside the settings file. Leave blank to keep the current key.",
      kagiApiKeySet: "A key is configured.",
      kagiApiKeyUnset: "No key is configured; search is unavailable until one is.",
      kagiApiKeyEnv: "API key reference",
      kagiApiKeyEnvHint: "Credential reference the provider resolves; defaults to KAGI_API_KEY.",
      kagiBaseUrl: "Endpoint",
      kagiBaseUrlHint: "Kagi Search API v1 base. Leave blank to use the default.",
      kagiLimit: "Result limit",
      kagiLimitHint: "Fallback result count (1–1024) when the tool passes none.",
      kagiSafeSearch: "Safe search",
      kagiSafeSearchCheck: "Request Kagi safe search",
      kagiSafeSearchHint: "Asks Kagi to filter adult content.",
      overridden: "Overridden",
      reset: "Reset to default",
      invalidNumber: "Enter a whole number, or leave blank to use the default.",
      readOnly: "This deployment stores settings read-only.",
      save: "Save",
      saving: "Saving…",
      discard: "Discard",
      unsaved: "Unsaved",
      saveFailed: "The deployment did not accept these values; they were left for you to correct.",
    };
    const zh = {
      kagiTitle: "Kagi 搜索",
      kagiDescription: "Kagi Search 搜索提供方。",
      kagiApiKey: "API Key",
      kagiApiKeyHint: "不写入设置文件。留空表示保持当前密钥。",
      kagiApiKeySet: "已配置密钥。",
      kagiApiKeyUnset: "未配置密钥；配置之前搜索不可用。",
      kagiApiKeyEnv: "API Key 引用",
      kagiApiKeyEnvHint: "提供方解析的凭据引用；默认 KAGI_API_KEY。",
      kagiBaseUrl: "接口地址",
      kagiBaseUrlHint: "Kagi Search API v1 基地址。留空则使用默认地址。",
      kagiLimit: "结果数量",
      kagiLimitHint: "未指定时的默认结果数量（1–1024）。",
      kagiSafeSearch: "安全搜索",
      kagiSafeSearchCheck: "请求 Kagi 安全搜索",
      kagiSafeSearchHint: "要求 Kagi 过滤成人内容。",
      overridden: "已覆盖",
      reset: "恢复默认",
      invalidNumber: "请输入整数；留空表示使用默认值。",
      readOnly: "本部署的设置为只读。",
      save: "保存",
      saving: "保存中…",
      discard: "放弃修改",
      unsaved: "未保存",
      saveFailed: "本部署没有接受这些值，已保留供你修改。",
    };
    //#endregion

    //#region plugin
    const inject = ["slots", "locale", "connection", "remote", "settingsScope"];

    function apply(ctx) {
      const { api } = ctx.get("connection");
      const card = new KagiCardController(ctx.settingsScope.bind({ namespace: KAGI_NS }), api);

      ctx.effect(() => ctx.locale.register(NS, { en, zh }), "web-search-kagi: settings card dictionaries");
      ctx.effect(() => ctx.remote.$on("credentials/updated", (ref) => {
        card.refreshCredential(ref);
      }), "web-search-kagi: credential invalidations");

      ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
        name: "settings.plugin.item",
        key: KAGI_NS,
        locale: NS,
        inject: () => card.inject(),
      }, KagiCard));
    }
    //#endregion

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});

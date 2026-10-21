# Architecture

[PRODUCT_BRIEF.md](PRODUCT_BRIEF.md) describes what the product does. This document fixes how the code is split and which way dependencies point. `.dependency-cruiser.cjs` enforces every boundary below (`vp run deps`); change both together.

```text
apps/website ──► @fillasap/bridge ──► @fillasap/domain ──► valibot
apps/extension ─┘                    ▲
        └────────────────────────────┘
```

## Packages

| Package           | Holds                                                                                                         | May import                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `packages/domain` | Valibot schemas and inferred types for every concept; `Snapshot`, the versioned document the extension stores | `valibot` only                     |
| `packages/bridge` | The website ↔ content script protocol, its client, host, and `window` transport                               | `@fillasap/domain`, `valibot`      |
| `apps/website`    | The Preact SPA                                                                                                | both packages; never the extension |
| `apps/extension`  | The WXT extension                                                                                             | both packages; never the website   |

- Packages never import apps. Apps never import each other: they meet only at the bridge protocol.
- Packages export their TypeScript sources (`exports` → `./src/index.ts`); apps bundle them. A package `build` only type checks.
- `@fillasap/domain/testing` exports fixtures for tests; no `src/` file imports a test file.
- Every module is reachable from an entrypoint, a test, or a config (`no-orphans`), and there are no import cycles (`no-circular`).

## Website

```text
src/main.tsx ─► src/app ─► src/features/<name> ─► src/services ─► @fillasap/bridge
                   │              │
                   └──────────────┴──► src/ui
```

- `src/ui`: presentational components and pure helpers. It imports nothing from `features`, `services`, or `app`.
- `src/services/extension.ts`: the extension gateway, `createExtensionGateway()`, and the only module that imports `@fillasap/bridge`.
- `src/features/<name>`: state and views for one capability (`extension-status`, `explorer`). Features never import each other.
- `src/app`: composition. It picks the banner, the empty state, or the explorer from the extension state.
- `src/main.tsx`: mounts `App` with the real gateway. Nothing imports it.

Components take the gateway or data as props, so component tests use a fake gateway.

## Extension

| Folder            | Runs in                | Role                                                                                       |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `src/entrypoints` | (WXT)                  | Thin wiring: each file calls one `start*` function. Nothing imports an entrypoint.         |
| `src/content`     | The Fill ASAP website  | Bridge host. Relays known requests to the background and returns its reply.                |
| `src/background`  | The service worker     | Validates requests and senders, answers them from storage.                                 |
| `src/storage`     | The service worker     | Repositories over WXT `storage`; validates what it reads with the domain schemas.          |
| `src/popup`       | The toolbar popup      | Preact UI. Reads through a function it is given, never through content or background code. |
| `src/config`      | Build time             | `origins.ts`: the pages the content script runs on, per build mode.                        |
| `src/messaging`   | Content and background | The internal content ↔ background message schema.                                          |

`content` never imports `storage`, and `popup` never imports `content` or `background`.

## Bridge protocol v1

The website and the content script share a window, so they talk through `window.postMessage`. Every message is an envelope `{ channel: "fillasap", protocol: 1, kind, ... }`:

| Kind       | Sender         | Fields                                              |
| ---------- | -------------- | --------------------------------------------------- |
| `announce` | content script | `extensionVersion`; sent once on start              |
| `request`  | website        | `id`, `type`                                        |
| `response` | content script | `id`, then `ok: true, result` or `ok: false, error` |

Request types and their result schemas live in `RESULT_SCHEMAS` (`packages/bridge/src/protocol.ts`):

| Type          | Result                 |
| ------------- | ---------------------- |
| `ping`        | `{ extensionVersion }` |
| `getSnapshot` | `Snapshot`             |

- **Detection.** `client.detect()` resolves `installed` on the first `announce` or `ping` reply, and `missing` after the timeout (1.5 s by default). Either signal is enough, so the order in which the page and the content script load does not matter.
- **Validation.** The host answers only valid requests of a known type. The client validates every result against its schema and rejects with `BridgeError` on a timeout, an error reply, or a malformed result.
- **Versioning.** `protocol` changes only for an incompatible envelope or message change; adding a request type does not change it.

Inside the extension, the content script forwards `{ type }` with `browser.runtime.sendMessage`; the background replies `{ ok: true, result }` or `{ ok: false, error }`.

## Security model

The extension holds the user's data; the website only displays it.

- **Where the content script runs.** Production builds match only `https://fillasap.ai/*`, `https://fillasap.dev/*`, and `https://fillasap.io/*`. The website lives on fillasap.ai; fillasap.dev and fillasap.io are owned by the project and currently redirect to it at the Cloudflare edge, so the content script only runs there if they serve a page again. `development` and `test` builds add `http://localhost/*` and `http://127.0.0.1/*` (any port) for the dev server and end-to-end tests. `vp run test:extension-manifest` fails the build if a production manifest matches anything else.
- **Permissions.** Only `storage`: no host permissions, no `externally_connectable`, no access to other sites. The same check enforces it.
- **Who may ask.** The `window` transport accepts only messages whose `source` is the page's own window and whose `origin` is the page's own origin, and replies only to that origin. Pages on other origins, other windows, and frames get no answer (`tests/e2e/origin-guard.spec.ts`).
- **What they can get.** The bridge is read-only. The content script cannot read storage itself; it can only relay known request types to the background, which checks that the sender is its own extension.
- **What the website trusts.** Stored data is validated when the extension reads it and again when the website receives it. Data is rendered as text.
- **Script injection on a production origin** (fillasap.ai, or a page served again on fillasap.dev or fillasap.io) would let an attacker read the user's data through the bridge, so the website ships a strict CSP (`default-src 'self'`, no inline scripts or styles; `apps/website/build/content-security-policy.ts`). GitHub Pages sends no headers, so the CSP is a `<meta>` tag added to production builds only. Third-party scripts are not allowed on the website.
- Adding a write request widens this model; the `adding-a-bridge-message` skill requires documenting it here first.

## Toolchain

| Concern                  | Tool                                                                       |
| ------------------------ | -------------------------------------------------------------------------- |
| Package manager, tasks   | Vite+ (`vp`) with pnpm workspaces and a version catalog                    |
| Format, lint, type check | `vp check`: Oxfmt, Oxlint (type aware, with `eslint-plugin-sonarjs`), tsgo |
| Architecture boundaries  | dependency-cruiser (`.dependency-cruiser.cjs`)                             |
| Dead code, duplication   | Knip (`knip.jsonc`), jscpd                                                 |
| Unit and component tests | Vitest with V8 coverage; Vitest Browser Mode with Playwright Chromium      |
| End-to-end               | Playwright, headed Chromium with the test extension, in Docker on Xvfb     |
| Extension build          | WXT with `@preact/preset-vite`                                             |

Findings from the bootstrap spike, kept here because they explain the configuration:

- **WXT on Vite+.** The workspace overrides `vite` with `@voidzero-dev/vite-plus-core`; WXT 0.21 builds on it unchanged. `import.meta.env.MODE` is available in `defineContentScript` options, which is how `origins.ts` varies matches per build mode.
- **WXT tests.** `vitest.config.ts` passes its own `root` to `WxtVitest`; without it, Vitest projects started from the repo root cannot resolve the `@/` alias. `.wxt/` is generated by `wxt prepare` (the root `prepare` script, and explicitly in `Dockerfile.tests`, because pnpm skips `prepare` when `node_modules` is current).
- **dependency-cruiser and TypeScript 7.** dependency-cruiser 18 supports TypeScript below 7, so it parses with SWC (`parser: "swc"`, `@swc/core`); type-only imports are still detected. Its tsconfig-paths plugin resolves `paths` from the working directory, so each app has a `tsconfig.deps.json` repeating its `@/` alias from the repo root, and `vp run deps` cruises each app with its own.
- **WXT dev browser.** WXT 0.21 opens a browser only when its optional peer `web-ext` is installed; without it, `wxt` builds and asks you to load the extension by hand. `apps/extension` depends on `web-ext` for that reason. `wxt.config.ts` opens `http://localhost:5173/` (the website's fixed dev port) in a persistent profile under `.wxt/chrome-data`, which `vp run clean` deletes.
- **Knip and WXT.** Knip's WXT plugin expects `entrypoints/` at the package root; `knip.jsonc` lists `src/entrypoints` explicitly.
- **Extensions need a headed Chromium.** Playwright and Vitest Browser Mode run headed; Docker provides the display, so no window opens on the host.

# AGENTS.md

Working reference for AI coding agents and contributors: project context,
structure, build commands, contribution rules, and code guidelines. For
environment setup and user-facing docs see `README.md`.

## Table of Contents

- [Project Overview](#project-overview)
- [Technical Context](#technical-context)
- [Project Structure](#project-structure)
- [Build And Test Commands](#build-and-test-commands)
- [Contribution Instructions](#contribution-instructions)
- [Code Guidelines](#code-guidelines)
    - [System Design](#system-design)
    - [Architecture](#architecture)
    - [Code Quality](#code-quality)
    - [JSDoc Style](#jsdoc-style)
    - [Testing](#testing)
    - [Dependency Management](#dependency-management)
    - [Configuration & Documentation](#configuration--documentation)
    - [Markdown Formatting](#markdown-formatting)
    - [Other](#other)

## Project Overview

AdGuard Browser Assistant is a Manifest V3 browser extension for Chrome,
Firefox, Edge, and Opera. It is the companion UI for the AdGuard desktop
application: it connects to the desktop app via native messaging and lets
the user view and control filtering on the current tab — toggle
protection, pause filtering, view blocked-count stats, report websites,
and launch the element-blocking Assistant overlay.

The extension does not filter traffic itself; the desktop app is the
source of truth for all filtering state.

## Technical Context

- **Language/Version**: TypeScript 5.9, strict mode over
  TypeScript-only sources; transpiled by SWC via rspack's builtin
  swc-loader; type-checked with `tsc --noEmit`
- **Primary Dependencies**: React 16.13, MobX 6 + mobx-react, react-intl,
  webextension-polyfill, @adguard/assistant (element-blocking overlay),
  @adguard/translate; bundled with rspack (all targets)
- **Storage**: `browser.storage.local` (settings, consent) wrapped by
  `src/background/storage/` and `src/background/settings/`; app state
  itself arrives from the desktop app over native messaging
- **Testing**: Vitest 4 (configured in `vitest.config.ts`)
- **Target Platform**: Chrome/Edge 88+, Firefox 109+, Opera 74+
  (see `constants.js`); Manifest V3
- **Project Type**: single project — browser extension
- **Performance Goals**: N/A; keep the bundle small and the popup fast
  to open
- **Constraints**: sandboxed extension contexts; the background service
  worker can be terminated at any time; full functionality requires the
  AdGuard desktop app
- **Scale/Scope**: shipped to users of AdGuard for Windows/Mac

## Project Structure

```text
├── package.json            # Scripts and dependencies (pnpm)
├── constants.js            # Minimum supported browser versions
├── vitest.config.ts        # Vitest configuration for the unit suites
├── tsconfig.json           # TypeScript config (type checking only)
├── .eslintrc.js            # ESLint: airbnb-typescript, 4-space indent
├── .twosky.json            # Translation service config (base locale: en)
├── Dockerfile              # Multi-stage Docker build used by CI
├── DEPLOYMENT.md           # Deployment / CI reference
├── .github/workflows/      # GitHub Actions: ci, prepare-release,
│                           # publish-release, mirror
├── scripts/                # Build tooling: rspack, manifests, CRX,
│                           # translations; scripts/ci/ for Docker helpers
├── metadata/               # Store listing text and screenshots
├── types/                  # Global TypeScript declarations
├── src/
│   ├── _locales/           # 40 locales with messages.json translations
│   ├── assets/             # Fonts and images
│   ├── background/         # Service worker: state, native host API, messaging
│   ├── content-scripts/    # Per-tab scripts (launch assistant overlay)
│   ├── lib/                # Shared utilities; depends on no other layer
│   ├── options-ui/         # Options page (React + MobX)
│   ├── popup/              # Browser action popup (React + MobX)
│   ├── post-install/       # Post-install consent page (React)
│   └── shared/             # Shared UI: global styles, TermsAgreement
└── tests/                  # Vitest suites mirroring the src/ structure
```

## Build And Test Commands

- `pnpm dev` / `pnpm beta` / `pnpm release` — build the extension with
  rspack (all browser targets); append a browser name to build one
  target (`chrome`, `firefox`, `edge`; default is all); add `--watch`
  to rebuild on changes. Output: `build/`
- `pnpm test` — run the unit suites with Vitest
- `pnpm test:watch` — run tests in watch mode
- `pnpm lint` — full static check (ESLint + TypeScript)
- `pnpm lint:code` — ESLint only; `pnpm lint:code -- --fix` to autofix
- `pnpm lint:types` — TypeScript check only
- `pnpm locales upload|download|validate|info` — sync translations with
  the twosky service (see `scripts/translations/README.md`)
- `pnpm crx` — pack a Chromium build (requires certificate files)
- `pnpm artifacts:beta` / `pnpm artifacts:release` — full signed release
  artifacts (requires certificates; see `DEVELOPMENT.md` /
  `DEPLOYMENT.md`)
- `pnpm increment` — local-only patch bump of `package.json`. CI stamps
  a `-dev` version and publish injects the changelog version; nothing
  commits increment results anymore.

## Contribution Instructions

- You MUST verify your changes with the linter and type checker before
  considering a task complete:
    - `pnpm lint` — run the full check (ESLint + `tsc`)
    - `pnpm lint:code -- --fix` — fix lint issues automatically
    - `pnpm lint:types` — run the type checker alone
- You MUST update the unit tests for changed code; tests live in `tests/`
  and mirror the `src/` structure.
- You MUST run `pnpm test` and make sure all tests pass.
- When making changes to the project structure, you MUST update the
  Project Structure section in `AGENTS.md` so it stays accurate.
- If the prompt essentially asks you to refactor or improve existing
  code, check if it can be phrased as a code guideline; if so, add it to
  the relevant Code Guidelines section in `AGENTS.md`.
- After completing the task you MUST verify that the code you've written
  follows the Code Guidelines in this file.
- When changing `MIN_SUPPORTED_VERSION` in `constants.js`, you MUST update
  the browser compatibility section in `README.md`.
- When adding user-facing strings, add them only to the base locale
  `src/_locales/en/messages.json`; never edit other locales directly —
  they are synced from the twosky service via `pnpm locales`.

## Code Guidelines

### System Design

Design for a browser extension:

- The extension runs in a sandboxed environment with limited APIs —
  request only the permissions you need. The current set
  (`nativeMessaging`, `tabs`, `activeTab`, `contextMenus`, `storage`,
  `scripting` in `scripts/manifest.common.json`) must not grow without
  justification.
- Keep the extension lightweight — every added dependency increases the
  bundle size and slows down the popup. Avoid bundling large
  dependencies.
- Separate concerns across the extension's contexts: `src/background/`
  owns long-lived logic and all state; content scripts only interact with
  the page (launching the assistant overlay); `src/popup/`,
  `src/options-ui/`, and `src/post-install/` are UI-only. Do not put
  business logic in UI contexts or content scripts — delegate to the
  background script via messaging.
- Handle lifecycle correctly — the background service worker can be
  terminated at any time. Persist critical state to
  `browser.storage.local` (via the settings/storage modules), not in
  in-memory variables.
- Use message passing between extension contexts; never share mutable
  state directly. This project uses one-shot `runtime.sendMessage`
  (routed by `src/background/messageHandler.ts`) plus a long-lived port
  that pushes state updates to the popup
  (`src/background/longLivedMessageService/`).
- React to browser events asynchronously; never block the main thread of
  the page or the browser UI.
- Design for updates — the extension may be updated while the user is
  active. Migrate stored data on update (see
  `src/background/migrationService/`) and handle version transitions
  gracefully (`src/background/versions.ts`).

### Architecture

Universal design principles:

- **Separation of Concerns** — each extension context handles one aspect:
  background = state and I/O, content scripts = page interaction,
  popup/options = rendering.
- **Single Responsibility Principle** — every file, class, or function
  has one reason to change (e.g. `state.ts` owns app state,
  `messageHandler.ts` only routes messages).
- **Dependency Direction** — dependencies point inward/downward: UI
  contexts depend on messaging contracts, the background never imports
  from UI layers, `src/lib/` imports from no other layer.
- **Explicit Boundaries** — contexts interact through message contracts
  (`src/lib/types.ts`), not by reaching into each other's internals.
- **Data Flow Clarity** — desktop app → background state → pushed to the
  popup over the long-lived port; user actions → one-shot messages →
  background → desktop app.
- **Minimize Coupling, Maximize Cohesion** — each context is a separate
  bundler entry with its own MobX stores; shared code lives only in
  `src/lib/` and `src/shared/`.
- **Make Invalid States Impossible** — less enforced today: the codebase
  is fully typed under strict mode, but data crossing the
  messaging boundaries is untyped at runtime — validate it there instead
  of trusting types alone.
- **Observability Built-in** — less critical in an extension (no backend
  metrics), but all contexts still log through `src/lib/logger.ts`
  instead of `console`.
- **Keep It Boring** — prefer well-understood patterns (MobX stores,
  switch-based message routing) over clever or novel solutions.

Layers, from top to bottom:

| Layer | Responsibility | Examples |
| --- | --- | --- |
| UI contexts | Render UI, send user intents via messaging | `src/popup/`, `src/options-ui/` |
| Content scripts | Page interaction, assistant overlay | `src/content-scripts/start-assistant.ts` |
| Background | Owns app state, routes messages, persists settings | `src/background/state.ts`, `src/background/messageHandler.ts` |
| Native host API | Native messaging transport to the desktop app | `src/background/api/nativeHostApi.ts` |
| Shared utilities | Leaf helpers usable by any layer | `src/lib/`, `src/shared/` |

```text
popup / options-ui / post-install / content-scripts
     |  (one-shot runtime.sendMessage; long-lived port for popup state)
     v
background (state, messageHandler, settings, storage)
     |  (native messaging via background/api/)
     v
AdGuard desktop app (native host)

Any layer may import from src/lib/ and src/shared/.
src/lib/ and src/shared/ import from no other src/ layer.
```

UI contexts may message the background; the background must not import UI
modules. `src/lib/` must stay a leaf.

**Known exclusions** (to be fixed):

- `src/background/localStorage.ts` is a dead no-op wrapper (marked with a
  TODO) still referenced by `updateService.ts`.

### Code Quality

- All code must pass `pnpm lint` (ESLint airbnb-typescript +
  `tsc --noEmit`). Do not weaken `.eslintrc.js` or `tsconfig.json` rules
  to make code pass.
- Formatting is enforced by ESLint, not a separate formatter: 4-space
  indent, max line length 120, single quotes, semicolons.
- Import order is linted (`import/order`): React packages first, then
  other externals, `@adguard/*` after them, internal/parent/sibling
  modules, `.pcss` style imports last; blank lines between groups; long
  multi-name imports are split one-per-line (`import-newlines`).
- Comment intent, not mechanics; see the JSDoc Style section for what
  must be documented and how.
- Error handling: normalize unknown caught errors with `getErrorMessage`
  from `src/lib/errors.ts`; log errors via `src/lib/logger.ts` rather
  than `console`.
- Naming: files use camelCase (`messageHandler.ts`); classes and React
  components use PascalCase (`TabsService.ts`, `SettingsStore.ts`); test
  files use the `*.test.ts` suffix. Include units of measurement in names
  of variables holding physical quantities (e.g. `filteringPauseTimeoutMs`,
  `retryDelaySec`), not only in comments.
- All first-party sources are TypeScript; only root-level tool configs
  (`.eslintrc.js`, `postcss.config.js`, `constants.js`) remain
  JavaScript. Match the style of the surrounding code.

### JSDoc Style

JSDoc conventions are enforced by `eslint-plugin-jsdoc` through the
`plugin:jsdoc/recommended-error` preset and the JSDoc tiers in
`.eslintrc.js`; `pnpm lint` rejects non-conforming blocks, so follow
these rules on the first pass.

**Declarations that require a doc block:**

- Classes, class properties, function declarations, and method
  definitions — including constructors, getters, and setters — MUST
  carry a JSDoc block with a description.
- Arrow functions and function expressions are exempt: do not document
  every inline callback or component. Once a function carries a doc
  block, the block must satisfy every completeness rule below.
- Every linted file except `tests/` MUST open with a file overview: a
  `@file` tag followed by a one-line description of the file's purpose.

**Tag completeness:**

- Document every parameter with `@param` and a description, in
  signature order; tag a destructured parameter at the root, not per
  field.
- Describe the return value with `@returns` when the function returns
  one, and only then (a `@returns` tag needs an actual return
  statement).
- Add `@throws` when a documented function throws; the description is
  optional.
- Write the block description and the `@param`, `@returns`, and
  `@throws` descriptions as complete sentences: start with a capital
  letter and end with a period (`e.g.` and `i.e.` are allowed).

**Tag style:**

- Do not write `{type}` annotations in tags; TypeScript already carries
  the types.
- Do not use ` - ` separators between a tag and its description.
- Order tags per the sequence `@file`, `@template`/`@class`/`@async`,
  `@note`, `@see`, `@param`, `@returns`, `@throws`, `@example`; keep
  the block dense — no blank lines between tags or between the
  description and the first tag.
- `@note` is the only custom tag. An unrecognized tag yields a
  `check-tag-names` warning (warnings alone never fail the build);
  placed among other tags it can also trip the `sort-tags` ordering
  error, which does fail lint.

### Testing

- Framework: Vitest 4, configured in `vitest.config.ts` (node
  environment, globals disabled — suites import `describe`/`it`/`expect`
  from `vitest`).
- Tests live in `tests/` and mirror the `src/` structure; name files
  `*.test.ts` (e.g. `tests/background/state.test.ts` tests
  `src/background/state.ts`).
- Mock browser APIs with `vi.mock('webextension-polyfill', ...)`; mock
  module-level collaborators (`log`, `notifier`, `nanoid`, `consent`) at
  the module boundary, importing `vi` from `vitest`.
- Coverage is currently limited to `src/lib/` helpers and locale
  resolution; when changing stores or background modules, add or update
  tests in `tests/`.
- All tests must pass before pushing — the `pre-push` husky hook runs
  `pnpm test`.

### Dependency Management

- **Pin all dependency versions explicitly** — do not use version ranges
  that allow automatic upgrades to untested versions.
- **Prefer vanilla solutions** — use built-in language and browser APIs
  when they adequately solve the problem. Only add a dependency when it
  provides significant value over a vanilla implementation.
- **Reputable sources only** — dependencies MUST come from
  well-established, actively maintained projects. Evaluate by download
  counts, repository activity, and known maintainers.
- **Avoid unpopular libraries** — do NOT add niche or obscure packages
  with limited community adoption. These pose security risks and may
  become unmaintained.
- **Minimize dependency count** — each new dependency increases attack
  surface, bundle size, and maintenance burden. Justify every addition.
- **Use the latest stable version** — when adding a new dependency,
  explicitly check the package registry for the latest stable release and
  use it. Do not copy outdated version numbers from memory, training
  data, or other projects' lock files.

**Rationale**: fewer, well-vetted dependencies reduce security
vulnerabilities, supply-chain risks, and long-term maintenance costs. The
repo additionally enforces a 7-day `minimumReleaseAge` on newly published
package versions in `pnpm-workspace.yaml` (excluding `@adguard/*`).

**Known exclusions** (to be fixed):

- Most entries in `package.json` use caret ranges rather than exact pins;
  `pnpm-lock.yaml` pins the resolved tree in practice.
- `react`/`react-dom` are pinned at 16.13.0 and outdated; upgrading is a
  larger effort tied to `mobx-react`/`react-intl` compatibility.
- The full `lodash` package is a dependency; only per-function path
  imports (e.g. `lodash/isEqual`) are used, which limits bundle impact.

### Configuration & Documentation

- Build behavior is configured via the `BUILD_ENV` environment variable
  (`dev` | `beta` | `release`), set by the npm scripts; the browser
  target is a positional argument to the bundle script.
- Signing credentials (`certificate-beta.pem`,
  `certificate-release.pem`) are local secrets for manual builds —
  never commit them; the gitignored `private/AdguardBrowserAssistant/`
  directory is the place for such files. CI loads PEMs from Vault (see
  `DEPLOYMENT.md`).
- Translations are configured in `.twosky.json` (project id, base locale
  `en`, language list) and `scripts/translations/config.json`.
- Keep documentation in sync with code:
    - Build/development workflow changes → `DEVELOPMENT.md` / `README.md`
    - CI/CD or deploy changes → `DEPLOYMENT.md`
    - Minimum browser versions in `constants.js` → browser compatibility
      section in `README.md`
    - Project structure, commands, conventions → `AGENTS.md`
    - Notable user-facing changes → `CHANGELOG.md`
    - Firefox beta install link → `FIREFOX_BETA.md`
- Do not hardcode secrets or environment-specific values in source.

### Markdown Formatting

All Markdown files MUST follow these formatting rules:

- **Line length**: Keep lines at most 80 characters, but don't overwrap
  the lines artificially short just to hit the limit, keep them close to
  80 characters where possible. This is not a hard lint gate, but SHOULD
  be followed for readability. Lines inside fenced code blocks are exempt
  from this limit.
- **Unordered lists**: Use dashes (`-`) for bullet points. Indent nested
  list items by 4 spaces.
- **Continuation lines**: When a list item wraps to the next line, align
  the continuation with the first character of the item text, not the
  list marker. This applies to all list types (ordered and unordered).
- **Emphasis**: Use asterisks (`*`) for emphasis (`*italic*`,
  `**bold**`). Do NOT use underscores.
- **Headings**: Duplicate heading names are allowed only among sibling
  headings (same parent level). Avoid duplicates across different levels.
- **Inline HTML**: Avoid raw HTML in Markdown. The only allowed elements
  are `<a>`, `<p>`, `<details>`, `<summary>`, and `<img>`.
- **Trailing spaces**: Do NOT leave trailing whitespace on any line. Do
  NOT use two-space line breaks — use a blank line instead.
- **Bare URLs**: Bare URLs are permitted and do not need to be wrapped in
  angle brackets.
- **Table formatting**: Align table columns with padding when the table
  fits within 80 characters. If the table exceeds 80 characters or
  triggers an MD060 linter warning, switch to a compact format using
  single spaces only. This applies to the separator row as well—it should
  be written as `| --- |`, not `|--|`.

  Example of correct layout:

  ```markdown
  | Col1 | Col2 |
  | --- | --- |
  | Value1 | Value2 |
  ```

  Do NOT use extra padding or alignment characters beyond single spaces.

**Rationale**: Uniform Markdown formatting improves readability for both
humans and AI agents that consume project documentation.

### Other

- Commit messages are prefixed with the Jira issue key, with no colon
  after it (e.g. `AG-53631 Add docker build to browser-assistant`).
- Husky hooks: `pre-commit` runs `pnpm lint`, `pre-push` runs
  `pnpm test`.
- Localization workflow: edit only the base locale
  `src/_locales/en/messages.json`, then `pnpm locales upload`; fetch
  translations with `pnpm locales download`; check readiness with
  `pnpm locales info`.

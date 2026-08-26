# Development

Development setup and workflow for AdGuard Browser Assistant. For
user-facing documentation see `README.md`; for contribution rules and
code guidelines see `AGENTS.md`.

- [Prerequisites](#prerequisites)
- [Build](#build)
- [Lint](#lint)
- [Tests](#tests)
- [Localization](#localization)
- [CRX Beta and Release Builds](#crx-beta-and-release-builds)
- [Artifacts (local)](#artifacts-local)
- [How to debug without AdGuard application](#how-to-debug-without-adguard-application)
- [Testing Browser Assistant build with AdGuard](#testing-browser-assistant-build-with-adguard)

## Prerequisites

- [Node.js](https://nodejs.org/) with [pnpm](https://pnpm.io/)
- `pnpm install`

## Build

- `pnpm dev` / `pnpm beta` / `pnpm release` (specify chrome | firefox | edge | all by default)
    - add `--watch` if you want to watch for changes

Builds will be located in the `build` directory.

## Lint

- `pnpm lint` — ESLint over the TypeScript sources plus the
  `tsc --noEmit` strict type check

## Tests

- `pnpm test` — runs the Vitest suites in `tests/`

## Localization

- setup your project locales, directories in the file `scripts/translations/config.json`
- `pnpm locales upload` used to upload base `en` locale
- `pnpm locales download` run to download and save all locales

## CRX Beta and Release Builds

- Place PEM certificates under
  `private/AdguardBrowserAssistant/certificate-beta.pem` and
  `certificate-release.pem` (directory is gitignored).
- `pnpm crx` (with `BUILD_ENV=beta|release`) packs the Chromium build
  into a signed CRX and writes `update.xml`.

## Artifacts (local)

- `pnpm artifacts:beta` — Chrome beta zip + CRX + `update.xml`
  (needs beta certificate).
- `pnpm artifacts:beta-firefox` — Firefox beta zip + `update.json`
  (signing for static distribution is done in CI via `go-webext`).
- `pnpm artifacts:release` — Chrome/Edge/Firefox release zips + CRX +
  `update.xml` (needs release certificate).

CI/CD packaging, store submit, and static deploy are documented in
`DEPLOYMENT.md`. Do not use Bamboo; pipelines live under
`.github/workflows/`.

## How to debug without AdGuard application

- Go to file `src/background/api/index.ts` and read instructions

- Whenever you need to change the API state, do it via the browser console
  from the background page (e.g., `hostData.appState.isProtectionEnabled = false` disables AdGuard protection).
- Structure of the `hostData` object:

```js
{
    result: 'ok',
    version: '7.3.2496',
    apiVersion: '3',
    isValidatedOnHost: true,
    reportUrl: 'https://link.adtidy.org/forward.html?action=report&from=popup&app=browser_assistant&url=http://example.org',
    appState: {
        isRunning: true,
        isProtectionEnabled: true,
        isLicenseExpired: false,
        isInstalled: true,
        isAuthorized: true,
        locale: 'ru',
    },
    currentFilteringState: {
        isFilteringEnabled: true,
        isHttpsFilteringEnabled: true,
        isPageFilteredByUserFilter: false,
        blockedAdsCount: 180,
        totalBlockedCount: 1234,
        originalCertIssuer: 'RapidSSL RSA CA',
        originalCertStatus: 'valid',
    },
}
```

## Testing Browser Assistant build with AdGuard

### Preconditions

- AdGuard installed and launched.
- Browser Assistant build installed.

### OSX instructions

**Step 1:**

- In Browser Assistant extension settings copy extension ID.
- Paste it in `devConfig.json` file:
    - for Chrome or Edge add to `chrome_extension_id` as array (see example below);
    - for Firefox add to `firefox_extension_id` as array (see example below).
- Save file in AdGuard folder `/Library/Application Support/com.adguard.mac.adguard/`
  or `/Library/Application Support/com.adguard.mac.adguard.debug/` depends on build configuration.

**Step 2:**

- Open Terminal.
- Type `cd /Library/Application\ Support/AdGuard\ Software/com.adguard.mac.adguard/`.
- Type `sudo chown root devConfig.json`.
- Type `sudo chmod 444 devConfig.json`.
- Type your Mac password.
- Type `ls -la /Library/Application\ Support/AdGuard\ Software/com.adguard.mac.adguard/`.

**Result:**

- `devConfig.json` file received root rights.

**Step 3:**

- Restart AdGuard.
- Tap on the Browser Assistant icon in a browser.

### Windows instructions

**Step 1:**

- In Browser Assistant extension settings copy extension ID.
- Paste it in `devConfig.json` file:
    - for Chrome or Edge add to `chrome_extension_id` as array (see example below);
    - for Firefox add to `firefox_extension_id` as array (see example below).
- Save file in AdGuard folder `C:\Program Files (x86)\Adguard`.

**Step 2:**

- Restart AdGuard.
- Tap on the Browser Assistant icon in a browser.

**Example of `devConfig.json`**

```json
{
    "chrome_extension_id": [
        "biolhaiicomblcmahaljilbdppdnvyib",
        "dfkjnvdkfvkvdjfnkddksjsdjnfjfdfj"
    ],
    "firefox_extension_id": [
        "extensionid@example.org"
    ]
}
```

where values in `chrome_extension_id` are:

- `biolhaiicomblcmahaljilbdppdnvyib` — extension ID for Chrome;
- `dfkjnvdkfvkvdjfnkddksjsdjnfjfdfj` — extension ID for Edge.

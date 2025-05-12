# AdGuard Browser Assistant

AdGuard Browser Assistant extension:
<https://adguard.com/en/adguard-assistant/overview.html>

This is a replacement for the [legacy assistant](https://github.com/AdguardTeam/AdguardAssistant) userscript
we were using before that.

- [Development](#development)
    - [Build](#build)
    - [Lint](#lint)
    - [Tests](#tests)
    - [Localization](#localization)
    - [CRX Beta and Release Builds](#crx-beta-and-release-builds)
    - [XPI Builds](#xpi-builds)
    - [Artifacts](#artifacts)
    - [How to debug without AdGuard application](#how-to-debug-without-adguard-application)
    - [Testing Browser Assistant build with AdGuard](#testing-browser-assistant-build-with-adguard)
- [Permissions](#permissions)
- [Acknowledgments](#acknowledgments)
- [Minimum supported browser versions](#browser-compatibility)

## Development

### Build

- `pnpm install`
- `pnpm dev` / `pnpm beta` / `pnpm release` (specify chrome | firefox | edge | all by default)
    - add `--watch` if you want to watch for changes

Builds will be located in the `build` directory.

### Lint

- `pnpm lint`

### Tests

- `pnpm test`

### Localization

- `setup your project locales, directories in the file scripts/translations/config.json`
- `pnpm locales upload` used to upload base `en` locale
- `pnpm locales download` run to download and save all locales

### CRX Beta and Release Builds

- Put the repository with the `certificate-beta.pem`, `certificate-release.pem` files to the project root directory.
- `pnpm crx:beta` and `pnpm crx:release` create web extension files for Chromium and Google Chrome browsers —
  build, zipped build, and update manifest XML document.
  You must have the `certificate-beta.pem` or `certificate-release.pem` to run the corresponding command.

### XPI Builds

- Put the repository with the `mozilla_credentials.json` file containing `apiKey` and `apiSecret` properties
  with the values of type string to the project root directory.
- `pnpm xpi` create web extension files for Mozilla Firefox browser — build, zipped build
  and update manifest JSON document. You must have the `mozilla_credentials.json` to run this commands.

### Artifacts

- `CREDENTIALS_PASSWORD=<password> pnpm artifacts:beta`
- `CREDENTIALS_PASSWORD=<password> pnpm artifacts:release`

Respectively creates Chrome and Firefox beta and release builds, zipped builds, documents for update
and text file containing current version, signs the Firefox build.

### How to debug without AdGuard application

- Go to file `src/background/api/index.js` and read instructions

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

### Testing Browser Assistant build with AdGuard

#### Preconditions

- AdGuard installed and launched.
- Browser Assistant build installed.

#### OSX instructions

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

#### Windows instructions

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

## Permissions

- Permission `tabs` allows to indicate the status of websites by changing the icon color.
- Permission `activeTabs` allows to inject script
  of [adguard-assistant](https://github.com/AdguardTeam/AdguardAssistant) into the content page.
- Permission `nativeMessaging` allows to communicate with the native host.

## Acknowledgments

This software wouldn't have been possible without:

- [React](https://github.com/facebook/react)
- [MobX](https://github.com/mobxjs/mobx)
- [Babel](https://github.com/babel/babel)
- [Jest](https://github.com/facebook/jest)
- and many more npm packages.

For a full list of all `npm` packages in use, please take a look at [package.json](package.json) file.

## <a name="browser-compatibility"></a> Minimum supported browser versions

<!-- NOTE: see MIN_SUPPORTED_VERSION in ./scripts/consts.ts -->

| Browser                 | Version |
|------------------------ |---------|
| Chromium-based browsers | ✅ 88   |
| Firefox                 | ✅ 109  |
| Opera                   | ✅ 74   |

# AdGuard Browser Assistant

AdGuard Browser Assistant extension:
https://adguard.com/en/adguard-assistant/overview.html

This is a replacement for the [legacy assistant](https://github.com/AdguardTeam/AdguardAssistant) userscript we were using before that.

## Build

- `yarn clear` - removes build and node modules directories
- `yarn install`
- `yarn dev` / `yarn beta` / `yarn release`

Builds will be located in the `build` directory.

## Lint

- `yarn lint`

## Tests

- `yarn test`

## Localisation

- `setup your project locales, directories in the file tasks/locales.js`
- `yarn locales:upload` used to upload base `en` locale
- `yarn locales:download` run to download and save all locales

## CRX Beta and Release Builds

- Put the repository with the `certificate-beta.pem`, `certificate-release.pem` files to the project root directory.
- `yarn crx:beta` and `yarn crx:release` create web extension files for Chromium and Google Chrome browsers - build, zipped build, and update manifest XML document. You must have the `certificate-beta.pem` or `certificate-release.pem` to run the corresponding command.

## XPI Builds

- Put the repository with the `mozilla_credentials.json` file containing `apiKey` and `apiSecret` properties with the values of type string to the project root directory.
- `yarn xpi` create web extension files for Mozilla Firefox browser - build, zipped build and update manifest JSON document. You must have the `mozilla_credentials.json` to run this commands

## Artifacts

- `CREDENTIALS_PASSWORD=<password> yarn artifacts:beta`
- `CREDENTIALS_PASSWORD=<password> yarn artifacts:release`

Respectively creates Chrome and Firefox beta and release builds, zipped builds, documents for update and text file containing current version, signs the Firefox build.

## How to debug without AdGuard application

- Go to file `src/background/api/index.js` and read instructions

- Whenever you need to change the API state, do it via the browser console from the background page (e.g., `hostData.appState.isProtectionEnabled = false` disables AdGuard protection).
- Structure of the hostData
```
    result: 'ok',
    version: '7.3.2496',
    apiVersion: '3',
    isValidatedOnHost: true,
    reportUrl: 'https://reports.adguard.com/en/new_issue.html?url=http://example.org/',
    appState: {
        isRunning: true,
        isProtectionEnabled: true,
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
```

## Minimum supported browser versions
| Browser                 	| Version 	|
|-------------------------	|:-------:	|
| Chromium Based Browsers 	|    55   	|
| Firefox                 	|    54   	|
| Opera                   	|    42   	|
| Edge                    	|    79   	|

## Permissions
- Permission `tabs` allows to indicate the status of websites by changing the icon color
- Permission `activeTabs` allows to inject script of adguard-assistant https://github.com/AdguardTeam/AdguardAssistant into the content page
- Permission `nativeMessaging` allows to communicate with the native host

## Acknowledgments
We are thankful to the developers of the libraries used to build our extension.

### `react`
* Source: https://github.com/facebook/react
* License: https://github.com/facebook/react/blob/master/LICENSE

### `webextension-polyfill`
* Source: https://github.com/mozilla/webextension-polyfill
* License: https://github.com/mozilla/webextension-polyfill/blob/master/LICENSE

### `react-intl`
* Source: https://github.com/formatjs/formatjs/tree/main/packages/react-intl
* License: https://github.com/formatjs/formatjs/blob/main/packages/react-intl/LICENSE.md

### `mobx`
* Source: https://github.com/mobxjs/mobx
* License: https://github.com/mobxjs/mobx/blob/mobx6/LICENSE

### `mobx-react`
* Source: https://github.com/mobxjs/mobx-react
* License: https://github.com/mobxjs/mobx-react/blob/master/LICENSE

### `lodash`
* Source: https://github.com/lodash/lodash
* License: https://github.com/lodash/lodash/blob/master/LICENSE

### `nanoid`
* Source: https://github.com/ai/nanoid
* License: https://github.com/ai/nanoid/blob/master/LICENSE

### `react-modal`
* Source: https://github.com/reactjs/react-modal
* License: https://github.com/reactjs/react-modal/blob/master/LICENSE

### `classnames`
* Source: https://github.com/JedWatson/classnames
* License: https://github.com/JedWatson/classnames/blob/master/LICENSE

### `babel`
* Source: https://github.com/babel/babel
* License: https://github.com/babel/babel/blob/main/LICENSE

### `axios`
* Source: https://github.com/axios/axios
* License: https://github.com/axios/axios/blob/master/LICENSE

### `crx`
* Source: https://github.com/oncletom/crx
* License: https://github.com/oncletom/crx/blob/master/LICENSE

### `eslint`
* Source: https://github.com/eslint/eslint
* License: https://github.com/eslint/eslint/blob/master/LICENSE

### `jest`
* Source: https://github.com/facebook/jest
* License: https://github.com/facebook/jest/blob/master/LICENSE

### `postcss`
* Source: https://github.com/postcss/postcss
* License: https://github.com/postcss/postcss/blob/master/LICENSE

### `web-ext`
* Source: https://github.com/mozilla/web-ext
* License: https://github.com/mozilla/web-ext/blob/master/LICENSE

### `webpack`
* Source: https://github.com/webpack/webpack
* License: https://github.com/webpack/webpack/blob/master/LICENSE

This list is not full, but all dependencies are listed in the `package.json` file. 

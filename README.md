# AdGuard Browser Assistant

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

## CRX Builds

- Put the repository with the `certificate.pem` file to the project root directory.
- `yarn crx` create web extension files for Chromium and Google Chrome browsers - build, zipped build, and update manifest XML document. You must have the `certificate.pem` to run this command

## XPI Builds

- Put the repository with the `mozilla_credentials.json` file containing `apiKey` and `apiSecret` properties with the values of type string to the project root directory.
- `yarn xpi` create web extension files for Mozilla Firefox browser - build, zipped build and update manifest JSON document. You must have the `mozilla_credentials.json` to run this commands

## Artifacts

- `yarn artifacts:beta`, `yarn artifacts:release` create Chrome and Firefox builds, zipped builds, documents for update and text file containing current version, signs the Firefox build.

## "How to debug extension without AdGuard apps"

- Replace `import api from './Api'` with `import api from './Stub/StubApi';` everywhere in the background script: `index.js` and `requestsApi.js`
- Changeable parameters of host are marked as @param in the class StubHost 

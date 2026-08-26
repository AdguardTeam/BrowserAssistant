# AdGuard Browser Assistant Beta for Firefox

The beta version of AdGuard Browser Assistant for Firefox is distributed
as a standalone XPI on `static.adtidy.org` (not the AMO store listing).
Install it manually from:

[Click to install assistant](https://static.adtidy.org/extensions/browserassistant/beta/firefox.xpi)

CI builds and deploys this XPI on **beta** tags via GitHub Actions
(`publish-release.yml` → `build-beta-firefox-output` → deployer module
`browser-assistant-webext-firefox-beta`). See `DEPLOYMENT.md`.

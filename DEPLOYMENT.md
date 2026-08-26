# Deployment — AdGuard Browser Assistant

AdGuard Browser Assistant is deployed via GitHub Actions. There is no
server infrastructure — deployment means publishing build artifacts
(signed CRX/XPI/ZIP files) to static file servers, submitting to browser
stores, and creating a GitHub Release on the public
`AdguardTeam/BrowserAssistant` mirror.

> **Channel model:** Tags containing `-beta` (e.g. `v1.2.0-beta.1`) go
> through the **beta** pipeline. Tags without a pre-release suffix
> (e.g. `v1.2.0`) go through the **release** pipeline. This matches the
> former Bamboo beta vs release plans.

## Table of Contents

- [Deployment Targets](#deployment-targets)
- [CI/CD Infrastructure](#cicd-infrastructure)
  - [CI Workflow](#ci-workflow)
  - [Release Preparation](#release-preparation)
  - [Publish Workflow](#publish-workflow)
  - [Mirror](#mirror)
- [Pipeline Flow](#pipeline-flow)
- [Docker Image](#docker-image)
- [Build Artifacts](#build-artifacts)
- [Version Tagging](#version-tagging)
- [Secrets](#secrets)
- [Follow-ups](#follow-ups)
- [Additional Resources](#additional-resources)

## Deployment Targets

| Target | What is deployed | Channels |
| --- | --- | --- |
| **static.adtidy.org** (Chrome) | `chrome.crx`, `chrome.zip`, `update.xml` | beta only |
| **static.adtidy.org** (Firefox) | `firefox.xpi`, `firefox.zip`, `update.json` | beta only |
| **Chrome Web Store** | `chrome.zip` | beta, release |
| **Firefox AMO** (listed) | `firefox.zip` + `source.zip` | release only |
| **Edge Add-ons** | `edge.zip` | release only |
| **GitHub Release** (`AdguardTeam/BrowserAssistant`) | Channel build assets | beta, release |
| **Opera add-ons** | Manual upload (no store API) | release |

Static uploads use the internal **deployer** service
(`vars.DEPLOYER_BASE_URL`). Modules:

- `browser-assistant-webext-chrome-beta`
- `browser-assistant-webext-firefox-beta`

Store listing IDs (public; same as Bamboo):

- Chrome Web Store beta: `hhaeiccdiaojoofohjiennalnphobkaf`
- Chrome Web Store release: `fbohpolgemkbfphodcfgnpjcmedcjhpn`
- Edge Add-ons product: `20976acd-ba42-4cbe-a4f2-250ca870c696`
- Firefox AMO id: `browserassistant@adguard.com`

## CI/CD Infrastructure

All CI/CD is managed via **GitHub Actions**. Workflow definitions live in
`.github/workflows/`. Jobs run on the `team-extensions` self-hosted
runner group.

### CI Workflow

**File:** `.github/workflows/ci.yml`

Runs on pull requests and pushes to `master`. Stamps a `-dev` version
via `ext-shared-actions/set-dev-version`, then builds, lints, and tests
via Docker `test-output`:

```text
DOCKER_BUILDKIT=1 docker build --target test-output --output ./output .
```

Uploads unsigned dev archives (`chrome.zip`, `firefox.zip`, `edge.zip`)
as workflow artifacts.

### Release Preparation

**File:** `.github/workflows/prepare-release.yml`

Triggered manually via `workflow_dispatch` with a `tag` input
(`v1.2.0` or `v1.2.0-beta.1`). Calls
`create-release-pr.yml` to open a release PR that finalizes
`CHANGELOG.md`.

When the release PR is merged to `master`, `publish-release.yml` takes
over.

### Publish Workflow

**File:** `.github/workflows/publish-release.yml`

Triggered when a `release-bump/*` PR from the release bot is merged, or
manually via `workflow_dispatch`.

1. **Tag** — `tag-from-changelog.yml` reads the version from
   `CHANGELOG.md` and creates `v<version>` / `v<version>-beta.N`.
2. **Build** — Injects the version into `package.json`, fetches the
   channel CRX certificate from Vault, builds
   `build-{beta|release}-output`.
3. **Beta static Chrome** — `deploy-to-static.yml` →
   `browser-assistant-webext-chrome-beta`.
4. **Chrome Web Store** — `deploy-to-chrome-web-store.yml` (beta or
   release item id).
5. **Release AMO** — `deploy-to-firefox-addons.yml` (listed) with
   `firefox.zip` + `source.zip` + approval notes.
6. **Release Edge** — `deploy-to-edge-addons.yml`.
7. **GitHub Release** — `create-gh-release.yml` on
   `AdguardTeam/BrowserAssistant` (Octopass).
8. **Beta Firefox (isolated)** — Docker `build-beta-firefox-output`
   signs via `go-webext`, then static deploy
   `browser-assistant-webext-firefox-beta`, then attaches assets to the
   GitHub Release.
9. **Slack** — `#adguard-extension-vcs`.

### Failure recovery

- Prefer **Re-run failed jobs**, not **Re-run all jobs**. Re-running
  everything force-retags and re-uploads store packages (CWS/AMO/Edge
  reject duplicate versions).
- AMO listed/sign can stay pending after a job timeout. Re-run the
  Firefox job later; a duplicate-version rejection usually means the
  first submission is still in review.
- Publish runs are serialized (`cancel-in-progress: false`). A hung
  Firefox sign holds the next publish until it finishes or times out
  (job cap 180 minutes).
- The green “published” Slack message waits for Firefox beta static +
  GitHub Release assets on beta tags; release-channel Firefox jobs are
  skipped.

### Mirror

**File:** `.github/workflows/mirror.yml`

On every push to `master` and on `v*` tags, mirrors to the public
`AdguardTeam/BrowserAssistant` repository.

## Pipeline Flow

```text
PR opened / push to master
  └─► ci.yml — set-dev-version + test-output

Manual: prepare-release.yml (tag input)
  └─► release PR (CHANGELOG.md)

Release PR merged to master
  └─► publish-release.yml
        ├─ tag-from-changelog.yml
        ├─ build (Chrome [+ Edge/Firefox zip on release])
        ├─ beta: deploy-static chrome
        ├─ Chrome Web Store
        ├─ release: AMO listed + Edge Add-ons
        ├─ create-gh-release.yml
        └─ beta only (parallel, may be slow):
              build-firefox-beta → static firefox → GH release assets
```

## Docker Image

Build and test jobs use the image in the Dockerfile `FROM … AS base`
line. AMO approval notes parse that same line so the reviewer pin cannot
drift.

The pnpm store is a BuildKit cache
(`--mount=type=cache,target=/pnpm-store`). Signing secrets are BuildKit
`--secret` mounts so they never appear in image layers.

CI helper scripts live under `scripts/ci/` (source archive, AMO approval
notes, gitignore excludes for Docker).

## Build Artifacts

Exact file lists live in the Dockerfile `*-output` stages and
`publish-release.yml` upload steps. Conceptually:

- **Beta Chrome** — `chrome.crx`, `chrome.zip`, `update.xml`
- **Beta Firefox** — `firefox.xpi`, `firefox.zip`, `update.json`
- **Release** — `chrome.zip` / `chrome.crx`, `edge.zip`, `firefox.zip`,
  `source.zip`, `approval-notes.txt`
- **CI** — unsigned `chrome.zip`, `firefox.zip`, `edge.zip`

## Version Tagging

- **Beta:** `v<version>-beta.N` (e.g. `v1.2.0-beta.1`)
- **Release:** `v<version>` (e.g. `v1.2.0`)
- Version is parsed from `CHANGELOG.md`. Chrome/Edge/CWS/AMO listed get
  the numeric core (suffix stripped) because stores reject `-beta.N`.
  Firefox beta stamps a toolkit version (`1.2.0-beta.1` → `1.2.0beta1`)
  into the XPI and `update.json` so successive betas auto-update, and
  the eventual `1.2.0` release still supersedes them.

## Secrets

CI secrets are **organization-level** (HashiCorp Vault). Org variable:
`VAULT_URL`.

### Extension-specific Vault secrets

- Path: `secret/data/ci-secrets/extensions-private-adguard-assistant`
- Role: `extensions-private-adguard-assistant`

| Key | Used by | Purpose |
| --- | --- | --- |
| `UNTRUSTED_certificate-beta` | `publish-release.yml` (beta build) | Chrome CRX signing PEM |
| `UNTRUSTED_certificate-release` | `publish-release.yml` (release build) | Chrome CRX signing PEM |

These replace the former Bamboo `extensions-private` checkout +
`bamboo_extensionsPassphrase` flow. **DevOps must create the Vault role
and keys before the first publish.**

### Shared store Vault secrets

| Role / path | Keys | Used by |
| --- | --- | --- |
| `firefox-amo-deployer` | `client-id`, `client-secret` | Beta Firefox `go-webext` sign; release `deploy-to-firefox-addons` |
| `edge-addons-deployer` | (via reusable workflow) | `deploy-to-edge-addons` |
| Chrome Web Store deployer | (via reusable workflow) | `deploy-to-chrome-web-store` |

The public GitHub Release uses Octopass (`id-token: write`) against
`AdguardTeam/BrowserAssistant`, not `GITHUB_TOKEN` on this private repo.

### Former Bamboo secret names (reference)

| Bamboo | Replacement |
| --- | --- |
| `bamboo_extensionsPassphrase` + `extensions-private` repo | Vault CRX PEMs |
| `bamboo_firefoxAmoClientId` / `bamboo_firefoxAmoClientSecret` | `firefox-amo-deployer` |
| Chrome Web Store client id/secret/refresh | shared CWS deployer in Vault |
| `bamboo_edgeClientId` / `bamboo_edgeSecretApiKey` | `edge-addons-deployer` |

## Follow-ups

- Provision Vault path/role
  `extensions-private-adguard-assistant` with
  `UNTRUSTED_certificate-beta` and `UNTRUSTED_certificate-release`.
- Ensure GitHub Environments exist with protection rules:
  `beta-static`, `chrome-webstore-beta`, `chrome-webstore-release`,
  `firefox-amo-release`, `edge-addons-release`, `github-release` (and any
  team terraform gates you use for required approvals).
- Octopass / deployer OIDC grants for the static modules if not already
  present for this repository.
- Confirm public mirror credentials for `AdguardTeam/BrowserAssistant`.
- After the first beta static deploy, confirm existing update URLs still
  resolve (`https://static.adtidy.org/extensions/browserassistant/beta/update.xml`
  and `update.json`). Deployer module names changed; paths must not.
- Disable the old Bamboo plans only after a green GHA CI run and a
  successful beta publish.

## Additional Resources

- [DEVELOPMENT.md](DEVELOPMENT.md) — local development
- [FIREFOX_BETA.md](FIREFOX_BETA.md) — Firefox beta install link
- [AGENTS.md](AGENTS.md) — agent / contributor guidelines
- [README.md](README.md) — product overview

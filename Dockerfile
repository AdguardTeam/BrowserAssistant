FROM adguard/extension-builder:22.22--0.4.1--0 AS base

WORKDIR /browser-assistant

ENV npm_config_store_dir=/pnpm-store

# ============================================================================
# Stage: deps
# Install dependencies (--ignore-scripts: no postinstall hooks needed)
# ============================================================================
FROM base AS deps

# pnpm-workspace.yaml carries install-affecting settings (autoInstallPeers)
# that must match the lockfile's recorded settings on --frozen-lockfile.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    pnpm install \
        --frozen-lockfile \
        --prefer-offline \
        --ignore-scripts

# ============================================================================
# Stage: source-deps
# ============================================================================
FROM deps AS source-deps

COPY . /browser-assistant

# ============================================================================
# Stage: test
# Runs: pnpm dev + pnpm lint + pnpm test
# Output: build/dev/ artifacts
# ============================================================================
FROM source-deps AS test

ARG TEST_RUN_ID

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    pnpm dev && \
    pnpm lint && \
    pnpm test && \
    mkdir -p /out/artifacts && \
    cp build/dev/chrome.zip /out/artifacts/ && \
    cp build/dev/firefox.zip /out/artifacts/ && \
    cp build/dev/edge.zip /out/artifacts/

FROM scratch AS test-output
COPY --from=test /out/ /

# ============================================================================
# Stage: sign-src-beta
# Symlinks the beta CRX certificate from a BuildKit secret (never copied into
# an image layer). Requires CERTIFICATE_PEM at build time.
# ============================================================================
FROM source-deps AS sign-src-beta

# sha256 of the PEM. BuildKit secret *content* is not in the RUN cache
# key; ARG values are. Echoing CERT_DIGEST here busts the signed layers
# when the certificate rotates (including re-runs of the same RUN_ID).
# The file is not read later — it exists only to bind the ARG to this layer.
ARG CERT_DIGEST

RUN --mount=type=secret,id=CERTIFICATE_PEM,mode=0444 \
    echo "${CERT_DIGEST}" > /tmp/.cert-digest && \
    mkdir -p private/AdguardBrowserAssistant && \
    ln -sf /run/secrets/CERTIFICATE_PEM \
        private/AdguardBrowserAssistant/certificate-beta.pem

# ============================================================================
# Stage: sign-src-release
# Symlinks the release CRX certificate from a BuildKit secret.
# ============================================================================
FROM source-deps AS sign-src-release

# See sign-src-beta: ARG is the cert-rotation cache key.
ARG CERT_DIGEST

RUN --mount=type=secret,id=CERTIFICATE_PEM,mode=0444 \
    echo "${CERT_DIGEST}" > /tmp/.cert-digest && \
    mkdir -p private/AdguardBrowserAssistant && \
    ln -sf /run/secrets/CERTIFICATE_PEM \
        private/AdguardBrowserAssistant/certificate-release.pem

# ============================================================================
# Stage: build-beta
# Runs: pnpm lint + pnpm test + pnpm locales validate + pnpm artifacts:beta
# Output: chrome.crx, update.xml, chrome.zip
# ============================================================================
FROM sign-src-beta AS build-beta

ARG TEST_RUN_ID
ARG CERT_DIGEST

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    --mount=type=secret,id=CERTIFICATE_PEM,mode=0444 \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    echo "${CERT_DIGEST}" > /tmp/.cert-digest && \
    pnpm lint && \
    pnpm test && \
    pnpm locales validate --min && \
    pnpm artifacts:beta && \
    mkdir -p /out/artifacts && \
    cp build/beta/chrome.crx /out/artifacts/ && \
    cp build/beta/update.xml /out/artifacts/ && \
    cp build/beta/chrome.zip /out/artifacts/

FROM scratch AS build-beta-output
COPY --from=build-beta /out/ /

# ============================================================================
# Stage: build-beta-firefox
# Runs: pnpm lint + pnpm test + pnpm locales validate + pnpm artifacts:beta-firefox
# + creates source.zip via archive-source.sh
# + signs with go-webext (static.adtidy.org distribution)
# Output: firefox.xpi, update.json, firefox.zip, source.zip,
#         approval-notes.txt
# ============================================================================
FROM source-deps AS build-beta-firefox-base

ARG TEST_RUN_ID

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    pnpm lint && \
    pnpm test && \
    pnpm locales validate --min && \
    pnpm artifacts:beta-firefox && \
    ./scripts/ci/archive-source.sh beta && \
    ./scripts/ci/generate-approval-notes.sh build/beta

FROM build-beta-firefox-base AS build-beta-firefox

RUN --mount=type=secret,id=FIREFOX_CLIENT_ID \
    --mount=type=secret,id=FIREFOX_CLIENT_SECRET \
    cd ./build/beta && \
    FIREFOX_CLIENT_ID="$(cat /run/secrets/FIREFOX_CLIENT_ID)" \
    FIREFOX_CLIENT_SECRET="$(cat /run/secrets/FIREFOX_CLIENT_SECRET)" \
    go-webext \
      -v \
      sign \
      firefox \
      -f 'firefox.zip' \
      -s 'source.zip' \
      -o 'firefox.xpi' \
      -n "$(cat approval-notes.txt)" && \
    mkdir -p /out/artifacts && \
    cp /browser-assistant/build/beta/firefox.xpi /out/artifacts/ && \
    cp /browser-assistant/build/beta/firefox.zip /out/artifacts/ && \
    cp /browser-assistant/build/beta/update.json /out/artifacts/ && \
    cp /browser-assistant/build/beta/source.zip /out/artifacts/ && \
    cp /browser-assistant/build/beta/approval-notes.txt /out/artifacts/

FROM scratch AS build-beta-firefox-output
COPY --from=build-beta-firefox /out/ /

# ============================================================================
# Stage: build-release
# Runs: pnpm lint + pnpm test + pnpm locales validate + pnpm artifacts:release
# + creates source.zip via archive-source.sh
# Output: edge.zip, chrome.crx, chrome.zip, firefox.zip,
#         update.xml, source.zip, approval-notes.txt
# ============================================================================
FROM sign-src-release AS build-release

ARG TEST_RUN_ID
ARG CERT_DIGEST

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    --mount=type=secret,id=CERTIFICATE_PEM,mode=0444 \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    echo "${CERT_DIGEST}" > /tmp/.cert-digest && \
    pnpm lint && \
    pnpm test && \
    pnpm locales validate --min && \
    pnpm artifacts:release && \
    ./scripts/ci/archive-source.sh release && \
    ./scripts/ci/generate-approval-notes.sh build/release && \
    mkdir -p /out/artifacts && \
    cp build/release/chrome.crx /out/artifacts/ && \
    cp build/release/chrome.zip /out/artifacts/ && \
    cp build/release/edge.zip /out/artifacts/ && \
    cp build/release/firefox.zip /out/artifacts/ && \
    cp build/release/update.xml /out/artifacts/ && \
    cp build/release/source.zip /out/artifacts/ && \
    cp build/release/approval-notes.txt /out/artifacts/

FROM scratch AS build-release-output
COPY --from=build-release /out/ /

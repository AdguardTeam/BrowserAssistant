FROM adguard/extension-builder:22.17--0.2--0 AS base

WORKDIR /browser-assistant

ENV npm_config_store_dir=/pnpm-store

# ============================================================================
# Stage: deps
# Install dependencies (--ignore-scripts: no postinstall hooks needed)
# ============================================================================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

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
    cp build/dev/build.txt /out/artifacts/ && \
    cp build/dev/chrome.zip /out/artifacts/ && \
    cp build/dev/firefox.zip /out/artifacts/ && \
    cp build/dev/edge.zip /out/artifacts/

FROM scratch AS test-output
COPY --from=test /out/ /

# ============================================================================
# Stage: build-beta
# Runs: pnpm lint + pnpm test + pnpm locales validate + pnpm artifacts:beta
# Requires private repo (extensions-private) for CRX signing
# Output: chrome.crx, update.xml, build.txt, chrome.zip
# ============================================================================
FROM source-deps AS build-beta

COPY --from=private . /browser-assistant/private

ARG TEST_RUN_ID

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    --mount=type=secret,id=CREDENTIALS_PASSWORD \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    export CREDENTIALS_PASSWORD="$(cat /run/secrets/CREDENTIALS_PASSWORD)" && \
    pnpm lint && \
    pnpm test && \
    pnpm locales validate --min && \
    pnpm artifacts:beta && \
    mkdir -p /out/artifacts && \
    cp build/beta/build.txt /out/artifacts/ && \
    cp build/beta/chrome.crx /out/artifacts/ && \
    cp build/beta/update.xml /out/artifacts/ && \
    cp build/beta/chrome.zip /out/artifacts/

FROM scratch AS build-beta-output
COPY --from=build-beta /out/ /

# ============================================================================
# Stage: build-beta-firefox
# Runs: pnpm lint + pnpm test + pnpm locales validate + pnpm artifacts:beta-firefox
# + creates source.zip via archive-source.sh
# + signs with go-webext
# No private repo needed
# Output: firefox.xpi, update.json, build.txt, firefox.zip, source.zip
# ============================================================================
FROM source-deps AS build-beta-firefox-base

ARG TEST_RUN_ID

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    --mount=type=secret,id=CREDENTIALS_PASSWORD \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    export CREDENTIALS_PASSWORD="$(cat /run/secrets/CREDENTIALS_PASSWORD)" && \
    pnpm lint && \
    pnpm test && \
    pnpm locales validate --min && \
    pnpm artifacts:beta-firefox && \
    ./bamboo-specs/scripts/archive-source.sh beta

FROM build-beta-firefox-base AS build-beta-firefox

RUN --mount=type=secret,id=FIREFOX_CLIENT_ID \
    --mount=type=secret,id=FIREFOX_CLIENT_SECRET \
    cd ./build/beta && \
    FIREFOX_CLIENT_ID="$(cat /run/secrets/FIREFOX_CLIENT_ID)" \
    FIREFOX_CLIENT_SECRET="$(cat /run/secrets/FIREFOX_CLIENT_SECRET)" \
    go-webext -v sign firefox -f 'firefox.zip' -s 'source.zip' -o 'firefox.xpi' && \
    mkdir -p /out/artifacts && \
    cp /browser-assistant/build/beta/build.txt /out/artifacts/ && \
    cp /browser-assistant/build/beta/firefox.xpi /out/artifacts/ && \
    cp /browser-assistant/build/beta/firefox.zip /out/artifacts/ && \
    cp /browser-assistant/build/beta/update.json /out/artifacts/ && \
    cp /browser-assistant/build/beta/source.zip /out/artifacts/

FROM scratch AS build-beta-firefox-output
COPY --from=build-beta-firefox /out/ /

# ============================================================================
# Stage: build-release
# Runs: pnpm lint + pnpm test + pnpm locales validate + pnpm artifacts:release
# Requires private repo (extensions-private) for CRX signing
# + creates source.zip via archive-source.sh
# Output: edge.zip, build.txt, chrome.crx, chrome.zip, firefox.zip, update.xml, source.zip
# ============================================================================
FROM source-deps AS build-release

COPY --from=private . /browser-assistant/private

ARG TEST_RUN_ID

RUN --mount=type=cache,target=/pnpm-store,id=browser-assistant-pnpm \
    --mount=type=secret,id=CREDENTIALS_PASSWORD \
    echo "${TEST_RUN_ID}" > /tmp/.test-run-id && \
    export CREDENTIALS_PASSWORD="$(cat /run/secrets/CREDENTIALS_PASSWORD)" && \
    pnpm lint && \
    pnpm test && \
    pnpm locales validate --min && \
    pnpm artifacts:release && \
    ./bamboo-specs/scripts/archive-source.sh release && \
    mkdir -p /out/artifacts && \
    cp build/release/build.txt /out/artifacts/ && \
    cp build/release/chrome.crx /out/artifacts/ && \
    cp build/release/chrome.zip /out/artifacts/ && \
    cp build/release/edge.zip /out/artifacts/ && \
    cp build/release/firefox.zip /out/artifacts/ && \
    cp build/release/update.xml /out/artifacts/ && \
    cp build/release/source.zip /out/artifacts/

FROM scratch AS build-release-output
COPY --from=build-release /out/ /

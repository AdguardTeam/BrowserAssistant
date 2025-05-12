/**
 * Minimum supported browser versions.
 *
 * IMPORTANT! Update browser compatibility in the README.md file when changing the versions.
 */
const MIN_SUPPORTED_VERSION = {
    /**
     * Same for Google Chrome and Microsoft Edge (which is Chromium-based)
     */
    CHROMIUM: 88,

    FIREFOX: 109,

    /**
     * There is no Opera-specific build. But since users can install Chromium build in Opera,
     * to ensure compatibility, we specify the version which is equivalent to Chromium 88.
     *
     * @see {@link https://blogs.opera.com/desktop/2021/02/opera-74-stable/}
     */
    OPERA: 74,
};

module.exports = { MIN_SUPPORTED_VERSION };

import browser from 'webextension-polyfill';

console.log('This string was printed from content-scripts/index.js', document.referrer);

document.addEventListener('DOMContentLoaded', () => {
    browser.runtime.sendMessage({ type: 'referrer', data: { referrer: document.referrer } });
});

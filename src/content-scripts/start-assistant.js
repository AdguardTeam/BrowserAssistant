import 'adguard-assistant';

export const startAssistant = (() => {
    let assistant;
    return (addRuleCallback) => {
        if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
            return;
        }

        if (!assistant) {
            assistant = global.adguardAssistant();
        } else {
            assistant.close();
        }

        assistant.start(null, addRuleCallback);
    };
})();

export const createGlobalActions = (browser, globalVar, actionTypes, apiName, apiType) => {
    // eslint-disable-next-line no-param-reassign
    globalVar[apiName] = {};
    Object.values(actionTypes)
        .forEach((msgType) => {
            // eslint-disable-next-line no-param-reassign
            globalVar[apiName][msgType] = async (...args) => {
                try {
                    await browser.runtime.sendMessage({
                        apiType,
                        msgType,
                        params: [...args],
                    });
                } catch (error) {
                    // Ignore message
                }
            };
        });
};

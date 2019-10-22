const port = window.chrome.runtime.connectNative('native_browser_assistant');

port.onMessage.addListener((response) => {
    console.log(`Received: id = ${response.id}, data = ${response.data}, parameters = ${JSON.stringify(response.parameters)}, appState = ${JSON.stringify(response.appState)}`, `, result = ${response.result}`);
});

window.chrome.browserAction.onClicked.addListener(() => {
    const id = Math.floor(Math.random() * 1000);
    console.log(`Sending:  id = ${id}`);
    const requestMessage = {
        id,
        type: 'init',
        parameters: {
            version: '1.2.3.5',
            apiVersion: '3',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
            type: 'native_browser_assistant',
        },
    };
    port.postMessage(requestMessage);
});

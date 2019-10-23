const port = chrome.runtime.connectNative('native_browser_assistant');

port.onMessage.addListener(({
    id, data, parameters, appState, result, requestId,
}) => {
    console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);
});

// chrome.browserAction.onClicked.addListener(() => {
function log({ id, type }) {
    console.log(`Sending:  id = ${id}, type= ${type}`);
}

// const id = Math.floor(Math.random() * 1000);
const requestMessage = {
    id: 0,
    type: 'init',
    parameters: {
        version: '1.2.3.5',
        apiVersion: '3',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        type: 'nativeAssistant',
    },
};
port.postMessage(requestMessage);
// });

const req1 = {
    type: 'getCurrentAppState',
    id: 1,
};

port.postMessage(req1);

const req2 = {
    type: 'getCurrentFilteringState',
    id: 2,
    parameters: {
        url: 'https://yandex.ru',
    },
};

port.postMessage(req2);

const req3 = {
    type: 'setProtectionStatus',
    id: 3,
    parameters: {
        isEnabled: true,
    },
};

port.postMessage(req3);

// const req4 = {
//     type: 'setHttpsFilteringStatus',
//     id: 4,
//     parameters: {
//         isEnabled: true,
//         isHttpsEnabled: true,
//         url: 'https://yandex.ru',
//     },
// };
//
// port.postMessage(req4);

const req5 = {
    type: 'addRule',
    id: 5,
    parameters: {
        ruleText: '||yandex.ru^',
    },
};

port.postMessage(req5);

const req6 = {
    type: 'removeRule',
    id: 6,
    parameters: {
        ruleText: '||yandex.ru^',
    },
};

port.postMessage(req6);

const req7 = {
    type: 'removeCustomRules',
    id: 7,
    parameters: {
        url: 'https://yandex.ru',
    },
};

port.postMessage(req7);

const req8 = {
    type: 'openOriginCert',
    id: 8,
    parameters: {
        domain: 'yandex.ru',
    },
};

port.postMessage(req8);


const req9 = {
    type: 'removeCustomRules',
    id: 9,
    parameters: {
        url: 'https://habr.com',
        referrer: 'https://yandex.ru',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    },
};

port.postMessage(req9);

const req10 = {
    type: 'openFilteringLog',
    id: 10,
};

port.postMessage(req10);

const map = {};
[requestMessage, req1, req2, req3, req5, req6, req7, req8, req9].forEach(({ id, type }) => { map[id] = type; });
console.log(map);

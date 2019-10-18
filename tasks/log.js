export default class Logs {
    error(text, data) {
        if (text) {
            throw new Error(text, data);
        } else {
            throw new Error('Unknown error');
        }
    }

    info(text) {
        if (text) {
            // eslint-disable-next-line no-console
            console.info(text);
        } else {
            // eslint-disable-next-line no-console
            console.info('unknown info');
        }
    }
}

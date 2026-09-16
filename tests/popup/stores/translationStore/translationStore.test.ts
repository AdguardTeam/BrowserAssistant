import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

vi.mock('webextension-polyfill', () => ({
    default: {
        i18n: {
            getUILanguage: () => 'ko-KR',
        },
    },
}));

// eslint-disable-next-line import/first
import TranslationStore from '../../../../src/popup/stores/translationStore';
// eslint-disable-next-line import/first
import type { RootStore } from '../../../../src/popup/stores';

describe('TranslationStore document lang', () => {
    const setAttribute = vi.fn();

    beforeEach(() => {
        setAttribute.mockClear();
        vi.stubGlobal('document', {
            documentElement: { setAttribute },
        });
    });

    const createStore = () => new TranslationStore({} as RootStore);

    it('initializes document lang from the browser UI locale before setLocale', () => {
        createStore();
        expect(setAttribute).toHaveBeenCalledWith('lang', 'ko');
    });

    it('writes the hyphenated resolved locale on setLocale', () => {
        const store = createStore();
        setAttribute.mockClear();

        store.setLocale('zh_CN');
        expect(setAttribute).toHaveBeenCalledWith('lang', 'zh-cn');
    });

    it('falls back to the browser locale for unsupported locales', () => {
        const store = createStore();
        setAttribute.mockClear();

        store.setLocale('xx');
        // 'xx' has no translations; browser UI locale is 'ko-KR'
        expect(setAttribute).toHaveBeenCalledWith('lang', 'ko');
    });
});

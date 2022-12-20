import checkLocale from '../../../../src/popup/stores/translationStore/checkLocale';
import messagesMap from '../../../../src/_locales';

describe('check locales', () => {
    it('for pt-PT returns valid key', () => {
        const result = checkLocale(messagesMap, 'pt-PT');
        expect(result).toEqual({
            suitable: true,
            locale: 'pt-pt',
        });
        expect(messagesMap[result.locale]).toBeTruthy();
    });

    it('finds messages for short locale code', () => {
        const result = checkLocale(messagesMap, 'zh');
        expect(result).toEqual({
            suitable: true,
            locale: 'zh_cn',
        });
        expect(messagesMap[result.locale]).toBeTruthy();
    });
});

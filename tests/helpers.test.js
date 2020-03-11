import { checkSomeIsTrue } from '../src/lib/helpers';

describe('checkSomeIsTrue', () => {
    it('should return true if at least one value is true', () => {
        expect(checkSomeIsTrue({
            one: true,
            two: false,
        }))
            .toEqual(true);
    });
    it('should return false if all values are false', () => {
        expect(checkSomeIsTrue({
            one: false,
            two: false,
        }))
            .toEqual(false);
    });
});

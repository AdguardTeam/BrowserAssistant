import { checkSomeIsTrue, compareSemver } from '../src/lib/helpers';

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

describe('compareSemver', () => {
    it('should return 0 if versions are equal', () => {
        expect(compareSemver('7.5.0', '7.5.0'))
            .toEqual(0);
        expect(compareSemver('2.5.0', '2.5.0'))
            .toEqual(0);
    });

    it('should return 1 if the first version argument is greater', () => {
        expect(compareSemver('7.5.3272.0', '7.5.0'))
            .toEqual(1);
        expect(compareSemver('7.5.1', '7.5.0'))
            .toEqual(1);
        expect(compareSemver('7.6.0', '7.5.0'))
            .toEqual(1);
    });

    it('should return -1 if the first version argument is lower', () => {
        expect(compareSemver('7.4.0', '7.5.0'))
            .toEqual(-1);
        expect(compareSemver('7.4.1', '7.5.0'))
            .toEqual(-1);
        expect(compareSemver('6.5.0', '7.5.0'))
            .toEqual(-1);
        expect(compareSemver('6.6.1', '7.5.0'))
            .toEqual(-1);
    });
});

import {
    describe,
    expect,
    it,
} from 'vitest';

import { toFirefoxBetaVersion } from '../../scripts/helpers';

describe('toFirefoxBetaVersion', () => {
    it('maps the beta number to the fourth numeric component', () => {
        expect(toFirefoxBetaVersion('1.4.27-beta.1')).toEqual('1.4.27.1');
        expect(toFirefoxBetaVersion('1.4.27-beta.2')).toEqual('1.4.27.2');
    });

    it('keeps versions without a beta number numeric', () => {
        expect(toFirefoxBetaVersion('1.4.27')).toEqual('1.4.27');
        expect(toFirefoxBetaVersion('1.4.27-beta')).toEqual('1.4.27');
    });
});

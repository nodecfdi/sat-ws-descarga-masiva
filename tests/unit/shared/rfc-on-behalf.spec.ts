import { AbstractRfcFilter } from '~/shared/abstract-rfc-filter';
import { RfcOnBehalf } from '~/shared/rfc-on-behalf';

describe('rfc on behalf', () => {
    test('extends abastract rfc filter', () => {
        expect(RfcOnBehalf.empty()).toBeInstanceOf(AbstractRfcFilter);
    });
});

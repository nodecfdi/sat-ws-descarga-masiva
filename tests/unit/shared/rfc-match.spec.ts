import { AbstractRfcFilter } from '~/shared/abstract-rfc-filter';
import { RfcMatch } from '~/shared/rfc-match';

describe('rfc match', () => {
    test('extends abastract rfc filter', () => {
        expect(RfcMatch.empty()).toBeInstanceOf(AbstractRfcFilter);
    });
});

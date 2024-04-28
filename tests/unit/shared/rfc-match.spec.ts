import { AbstractRfcFilter } from 'src/shared/abstract-rfc-filter';
import { RfcMatch } from 'src/shared/rfc-match';

describe('rfc match', () => {
  test('extends abastract rfc filter', () => {
    expect(RfcMatch.empty()).toBeInstanceOf(AbstractRfcFilter);
  });
});

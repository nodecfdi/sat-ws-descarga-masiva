import { AbstractRfcFilter } from '#src/shared/abstract_rfc_filter';
import { RfcMatch } from '#src/shared/rfc_match';

describe('rfc match', () => {
  test('extends abastract rfc filter', () => {
    expect(RfcMatch.empty()).toBeInstanceOf(AbstractRfcFilter);
  });
});

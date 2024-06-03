import { AbstractRfcFilter } from '#src/shared/abstract_rfc_filter';
import { RfcOnBehalf } from '#src/shared/rfc_on_behalf';

describe('rfc on behalf', () => {
  test('extends abastract rfc filter', () => {
    expect(RfcOnBehalf.empty()).toBeInstanceOf(AbstractRfcFilter);
  });
});

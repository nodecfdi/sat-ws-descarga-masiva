import { RfcFilterImplementation } from './rfc-filter-implementation.js';
import { type AbstractRfcFilter } from '#src/shared/abstract-rfc-filter';

describe('abstract rfc filter', () => {
  test('create with correct value', () => {
    const value = 'XXX01010199A';
    const uuid = RfcFilterImplementation.create(value);
    expect(value).toBe(uuid.getValue());
  });

  test('create with empty value', () => {
    const uuid = RfcFilterImplementation.empty();
    expect(uuid.getValue()).toBe('');
  });

  const providerInvalidValues = [
    ['empty', ''],
    ['invalid', 'XXX99120099A'],
  ];

  test.each(providerInvalidValues)(
    'construct with invalid value %s',
    (_name: string, value: string) => {
      const uuid = (): AbstractRfcFilter => RfcFilterImplementation.create(value);
      expect(uuid).toThrow('RFC is invalid');
    },
  );

  test.each(providerInvalidValues)('check invalid value', (_name: string, value: string) => {
    expect(RfcFilterImplementation.check(value)).toBeFalsy();
  });

  test('Json serialize', () => {
    const value = 'XXX01010199A';
    const expectedJson = JSON.stringify(value);
    const uuid = RfcFilterImplementation.create(value);
    expect(JSON.stringify(uuid)).toBe(expectedJson);
  });
});

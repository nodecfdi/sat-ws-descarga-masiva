import { DateTime as DateTimeImmutable, Settings } from 'luxon';
import { DateTime } from 'src/shared/date-time';

describe('date time', () => {
  let defaultTimeZone: string;

  beforeAll(() => {
    defaultTimeZone = DateTimeImmutable.now().zone.name;
    Settings.defaultZone = 'America/Mexico_City';
  });

  afterAll(() => {
    Settings.defaultZone = defaultTimeZone;
  });

  test('create using timezon zulu', () => {
    const date = DateTime.create('2019-01-14T04:23:24.000Z');

    expect(date.formatSat()).toBe('2019-01-14T04:23:24.000Z');
    expect(date.formateDefaultTimeZone()).toBe('2019-01-13T22:23:24.000-06:00');
  });

  test('create without timezone', () => {
    const date = DateTime.create('2019-01-13 22:23:24');

    expect(date.formatSat()).toBe('2019-01-14T04:23:24.000Z');
    expect(date.formateDefaultTimeZone()).toBe('2019-01-13T22:23:24.000-06:00');
  });

  test('format sat uses zulu timezone', () => {
    const date = DateTime.create('2019-01-13 22:23:24');

    expect(date.formatSat()).toBe('2019-01-14T04:23:24.000Z');
    expect(date.formateDefaultTimeZone()).toBe('2019-01-13T22:23:24.000-06:00');
  });

  test('create date time with timestamp', () => {
    const date = DateTime.create(316_569_600);

    expect(date.formatSat()).toBe('1980-01-13T00:00:00.000Z');
  });

  test('create date time with invalid string value', () => {
    expect(() => DateTime.create('foo')).toThrow('Unable to create a Datetime("foo")');
  });

  test('create date time with invalid argument', () => {
    const invalidDate = DateTimeImmutable.fromISO('2019-01-13 22:23:24');

    expect(() => DateTime.create(invalidDate)).toThrow('Unable to create a Datetime');
  });
});

import { DateTime } from '../../../src/shared/date-time';
import { DateTime as DateTimeImmutable } from 'luxon';
describe('date time', () => {
    const mexicoTimeZone = 'America/Mexico_City';


    test('create using timezon zulu', () => {
        const date = DateTime.create('2019-01-14T04:23:24.000Z', mexicoTimeZone);

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
        const date = DateTime.create(316569600);

        expect(date.formatSat()).toBe('1980-01-13T00:00:00.000Z');
    });

    test('create date time with invalid string value', () => {
        expect(() => DateTime.create('foo')).toThrowError('Unable to create a Datetime("foo")');
    });

    test('create date time with invalid argument', () => {
        const invalidDate = DateTimeImmutable.fromISO('2019-01-13 22:23:24');

        expect(() => DateTime.create(invalidDate)).toThrowError('Unable to create a Datetime');
    });
});

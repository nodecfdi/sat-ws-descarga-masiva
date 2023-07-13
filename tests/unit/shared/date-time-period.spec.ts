import { DateTime } from 'src/shared/date-time';
import { DateTimePeriod } from 'src/shared/date-time-period';

describe('date time period', () => {
    test('create with correct start date time and end date time', () => {
        const start = DateTime.create('2019-01-01 00:00:59');
        const end = DateTime.create('2019-01-01 00:01:00');
        const dateTimePeriod = DateTimePeriod.create(start, end);

        expect(dateTimePeriod.getStart()).toBe(start);
        expect(dateTimePeriod.getEnd()).toBe(end);
    });

    test('create with string values', () => {
        const startValue = '2019-01-01 00:00:59';
        const endValue = '2019-01-01 00:01:00';
        const dateTimePeriod = DateTimePeriod.createFromValues(startValue, endValue);

        expect(dateTimePeriod.getStart()).toStrictEqual(DateTime.create(startValue));
        expect(dateTimePeriod.getEnd()).toStrictEqual(DateTime.create(endValue));
    });

    test('create with end date time less  than start date time', () => {
        const start = DateTime.create('2019-01-01 00:00:59');
        const end = DateTime.create('2019-01-01 00:00:55');

        expect(() => DateTimePeriod.create(start, end)).toThrow('The final date must be greater than the initial date');
    });
});

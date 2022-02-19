import { PeriodStartGreaterThanEndException } from "../../../../src/request-builder/exceptions/period-start-greater-than-end-exception";
import { RequestBuilderException } from "../../../../src/request-builder/request-builder-exception";

describe('Period start greater than end exception', () => {
    test('exception instance of request builder exception', () => {
        const className = PeriodStartGreaterThanEndException;
        expect(className.toString()).toContain(RequestBuilderException.name);
    });

    test('get Properties', () => {
        const periodStart = 'foo';
        const periodEnd = 'bar';
        const exception = new PeriodStartGreaterThanEndException(periodStart, periodEnd);
        expect(exception.message).toBe('The period start "foo" is greater than end "bar"');
        expect(exception.getPeriodStart()).toBe(periodStart);
        expect(exception.getPeriodEnd()).toBe(periodEnd);
    });
});

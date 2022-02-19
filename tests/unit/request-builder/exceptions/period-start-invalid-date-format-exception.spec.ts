import { PeriodStartInvalidDateFormatException } from "../../../../src/request-builder/exceptions/period-start-invalid-date-format-exception";
import { RequestBuilderException } from "../../../../src/request-builder/request-builder-exception";

describe('Period start invalid date format exception', () => {
    test('exception instance of request builder exception', () => {
        const className = PeriodStartInvalidDateFormatException;
        expect(className.toString()).toContain(RequestBuilderException.name);
    });

    test('get Properties', () => {
        const periodStart = 'foo';
        const exception = new PeriodStartInvalidDateFormatException(periodStart);
        expect(exception.message).toBe('The start date time "foo" does not have the correct format');
        expect(exception.getPeriodStart()).toBe(periodStart);
    });
});

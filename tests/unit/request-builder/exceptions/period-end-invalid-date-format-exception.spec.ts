import { PeriodEndInvalidDateFormatException } from '../../../../src/request-builder/exceptions/period-end-invalid-date-format-exception';
import { RequestBuilderException } from '../../../../src/request-builder/request-builder-exception';

describe('Period end invalid date format exception', () => {
    test('exception instance of request builder exception', () => {
        const className = PeriodEndInvalidDateFormatException;
        expect(className.toString()).toContain(RequestBuilderException.name);
    });

    test('get Properties', () => {
        const periodEnd = 'foo';
        const exception = new PeriodEndInvalidDateFormatException(periodEnd);
        expect(exception.message).toBe('The end date time "foo" does not have the correct format');
        expect(exception.getPeriodEnd()).toBe(periodEnd);
    });
});

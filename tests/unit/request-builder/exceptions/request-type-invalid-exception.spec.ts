import { RequestTypeInvalidException } from "../../../../src/request-builder/exceptions/request-type-invalid-exception";
import { RequestBuilderException } from "../../../../src/request-builder/request-builder-exception";

describe('Period start greater than end exception', () => {
    test('exception instance of request builder exception', () => {
        const className = RequestTypeInvalidException;
        expect(className.toString()).toContain(RequestBuilderException.name);
    });

    test('get Properties', () => {
        const requestType = 'foo';
        const exception = new RequestTypeInvalidException(requestType);
        expect(exception.message).toBe('The request type "foo" is not CFDI or Metadata');
        expect(exception.getRequestType()).toBe(requestType);
    });
});

import { RfcIssuerAndReceiverAreEmptyException } from "../../../../src/request-builder/exceptions/rfc-issuer-and-receiver-are-empty-exception";
import { RequestBuilderException } from "../../../../src/request-builder/request-builder-exception";

describe('Period start greater than end exception', () => {
    test('exception instance of request builder exception', () => {
        const className = RfcIssuerAndReceiverAreEmptyException;
        expect(className.toString()).toContain(RequestBuilderException.name);
    });

    test('get Properties', () => {
        const exception = new RfcIssuerAndReceiverAreEmptyException();
        expect(exception.message).toBe('The RFC issuer and RFC receiver are empty');
    });
});

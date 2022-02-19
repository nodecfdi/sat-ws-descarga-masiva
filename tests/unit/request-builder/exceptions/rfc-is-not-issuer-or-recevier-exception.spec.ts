import { RfcIsNotIssuerOrReceiverException } from "../../../../src/request-builder/exceptions/rfc-is-not-issuer-or-recevier-exception";
import { RequestBuilderException } from "../../../../src/request-builder/request-builder-exception";

describe('Period start greater than end exception', () => {
    test('exception instance of request builder exception', () => {
        const className = RfcIsNotIssuerOrReceiverException;
        expect(className.toString()).toContain(RequestBuilderException.name);
    });

    test('get Properties', () => {
        const rfcSigner = 'a';
        const rfcIssuer = 'b';
        const rfcReceiver = 'c';
        const exception = new RfcIsNotIssuerOrReceiverException(rfcSigner, rfcIssuer, rfcReceiver);
        expect(exception.message).toBe('The RFC "a" must be the issuer "b" or receiver "c"');
        expect(exception.getRfcSigner()).toBe(rfcSigner);
        expect(exception.getRfcIssuer()).toBe(rfcIssuer);
        expect(exception.getRfcReceiver()).toBe(rfcReceiver);
    });
});

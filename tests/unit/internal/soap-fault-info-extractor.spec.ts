import { TestCase } from '../../test-case';
import { SoapFaultInfoExtractor } from '~/internal/soap-fault-info-extractor';
import { SoapFaultInfo } from '~/web-client/soap-fault-info';

describe('Name of the group', () => {
    test('extract on faulty response', () => {
        const source = TestCase.fileContents('authenticate/response-with-error.xml');
        const fault = SoapFaultInfoExtractor.extract(source);
        if (fault === undefined) {
            throw new Error('It was expected to receive an instace of SoapFaultInfo');
        }
        expect(fault).toBeInstanceOf(SoapFaultInfo);
        expect(fault.getCode()).toBe('a:InvalidSecurity');
        expect(fault.getMessage()).toBe('An error occurred when verifying security for the message.');
    });

    test('extract on not faulty response', () => {
        const source = TestCase.fileContents('authenticate/response-with-token.xml');
        const fault = SoapFaultInfoExtractor.extract(source);

        expect(fault).toBeUndefined();
    });

    test.each(['not valid xm', '', '</malformed>'])('extract on not xml content', () => {
        const source = TestCase.fileContents('authenticate/response-with-token.xml');
        const fault = SoapFaultInfoExtractor.extract(source);

        expect(fault).toBeUndefined();
    });
});

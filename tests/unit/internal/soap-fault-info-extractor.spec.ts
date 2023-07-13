import { useTestCase } from '../../test-case';
import { SoapFaultInfoExtractor } from 'src/internal/soap-fault-info-extractor';
import { SoapFaultInfo } from 'src/web-client/soap-fault-info';

describe('soap fault info extractor', () => {
    const { fileContents } = useTestCase();
    test('extract on faulty response', () => {
        const source = fileContents('authenticate/response-with-error.xml');
        const fault = SoapFaultInfoExtractor.extract(source);
        if (fault === undefined) {
            throw new Error('It was expected to receive an instace of SoapFaultInfo');
        }

        expect(fault).toBeInstanceOf(SoapFaultInfo);
        expect(fault.getCode()).toBe('a:InvalidSecurity');
        expect(fault.getMessage()).toBe('An error occurred when verifying security for the message.');
    });

    test('extract on not faulty response', () => {
        const source = fileContents('authenticate/response-with-token.xml');
        const fault = SoapFaultInfoExtractor.extract(source);

        expect(fault).toBeUndefined();
    });

    test.each(['not valid xml', '', '</malformed>'])('extract on not xml content', () => {
        const source = fileContents('authenticate/response-with-token.xml');
        const fault = SoapFaultInfoExtractor.extract(source);

        expect(fault).toBeUndefined();
    });
});

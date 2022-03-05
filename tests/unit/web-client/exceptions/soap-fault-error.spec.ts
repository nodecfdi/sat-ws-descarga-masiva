import { CRequest } from '../../../../src/web-client/crequest';
import { CResponse } from '../../../../src/web-client/cresponse';
import { SoapFaultInfo } from '../../../../src/web-client/soap-fault-info';
import { SoapFaultError } from '../../../../src/web-client/exceptions/soap-fault-error';
import { HttpClientError } from '../../../../src/web-client/exceptions/http-client-error';

describe('soap fault error', () => {
    test('properties', () => {
        const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
        const response = new CResponse(200, '', {});
        const fault = new SoapFaultInfo('x-code', 'x-message');
        const previous = new Error();

        const exception = new SoapFaultError(request, response, fault, previous);

        expect(exception).toBeInstanceOf(HttpClientError);
        expect(exception.getFault()).toBe(fault);
    });
});

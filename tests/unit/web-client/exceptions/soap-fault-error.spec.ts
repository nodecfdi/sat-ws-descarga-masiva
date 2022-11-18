import { CRequest } from '~/web-client/crequest';
import { CResponse } from '~/web-client/cresponse';
import { SoapFaultInfo } from '~/web-client/soap-fault-info';
import { SoapFaultError } from '~/web-client/exceptions/soap-fault-error';
import { HttpClientError } from '~/web-client/exceptions/http-client-error';

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

import { CRequest } from '#src/web_client/crequest';
import { CResponse } from '#src/web_client/cresponse';
import { HttpClientError } from '#src/web_client/exceptions/http_client_error';
import { SoapFaultError } from '#src/web_client/exceptions/soap_fault_error';
import { SoapFaultInfo } from '#src/web_client/soap_fault_info';

describe('soap fault error', () => {
  test('properties', () => {
    const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
    const response = new CResponse(200, '', {});
    const fault = new SoapFaultInfo('x-code', 'x-message');
    const previous = new Error('an error');

    const exception = new SoapFaultError(request, response, fault, previous);

    expect(exception).toBeInstanceOf(HttpClientError);
    expect(exception.getFault()).toBe(fault);
  });
});

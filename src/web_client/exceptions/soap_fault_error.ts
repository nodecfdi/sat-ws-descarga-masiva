import { type CRequest } from '../crequest.js';
import { type CResponse } from '../cresponse.js';
import { type SoapFaultInfo } from '../soap_fault_info.js';
import { HttpClientError } from './http_client_error.js';

export class SoapFaultError extends HttpClientError {
  private readonly _fault: SoapFaultInfo;

  public constructor(
    request: CRequest,
    response: CResponse,
    fault: SoapFaultInfo,
    previous?: Error,
  ) {
    const message = `Fault: ${fault.getCode()} - ${fault.getMessage()}`;
    super(message, request, response, previous);
    this._fault = fault;
  }

  public getFault(): SoapFaultInfo {
    return this._fault;
  }
}

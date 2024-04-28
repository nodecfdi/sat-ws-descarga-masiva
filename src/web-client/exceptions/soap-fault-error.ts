import { type CRequest } from '../crequest.js';
import { type CResponse } from '../cresponse.js';
import { type SoapFaultInfo } from '../soap-fault-info.js';
import { HttpClientError } from './http-client-error.js';

export class SoapFaultError extends HttpClientError {
  private readonly _fault: SoapFaultInfo;

  constructor(request: CRequest, response: CResponse, fault: SoapFaultInfo, previous?: Error) {
    const message = `Fault: ${fault.getCode()} - ${fault.getMessage()}`;
    super(message, request, response, previous);
    this._fault = fault;
  }

  public getFault(): SoapFaultInfo {
    return this._fault;
  }
}

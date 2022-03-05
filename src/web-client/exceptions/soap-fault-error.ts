import { CRequest } from '../crequest';
import { CResponse } from '../cresponse';
import { SoapFaultInfo } from '../soap-fault-info';
import { HttpClientError } from './http-client-error';

export class SoapFaultError extends HttpClientError {

    private _fault: SoapFaultInfo;

    constructor(request: CRequest, response: CResponse, fault: SoapFaultInfo, previous?: Error) {
        const message = `Fault: ${fault.getCode()} - ${fault.getMessage}`;
        super(message, request, response, previous);
        this._fault = fault;
    }

    public getFault(): SoapFaultInfo {
        return this._fault;
    }
}

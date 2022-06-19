import { RequestBuilderException } from '../request-builder-exception';

export class RequestTypeInvalidException extends RequestBuilderException {
    private _requestType: string;

    constructor(requestType: string) {
        super(`The request type "${requestType}" is not CFDI or Metadata`);
        this._requestType = requestType;
    }

    public getRequestType(): string {
        return this._requestType;
    }
}

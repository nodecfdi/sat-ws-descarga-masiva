import { RequestBuilderException } from "../request-builder-exception";

export class RequestTypeInvalidException extends RequestBuilderException {

    private requestType: string;

    constructor(requestType: string) {
        super(`The request type "${requestType}" is not CFDI or Metadata`);
        this.requestType = requestType;
    }

    public getRequestType(): string {
        return this.requestType;
    }
}

import { RequestBuilderException } from "../request-builder-exception";

export class RfcIssuerAndReceiverAreEmptyException extends RequestBuilderException {
    constructor() {
        super('The RFC issuer and RFC receiver are empty');
    }
}

import { RequestBuilderException } from "../request-builder-exception";

export class RfcIsNotIssuerOrReceiverException extends RequestBuilderException {

    private rfcSigner: string;
    private rfcIssuer: string;
    private rfcReceiver: string;

    constructor(rfcSigner: string, rfcIssuer: string, rfcReceiver: string) {
        super(`The RFC "${rfcSigner}" must be the issuer "${rfcIssuer}" or receiver "${rfcReceiver}"`);
        this.rfcSigner = rfcSigner;
        this.rfcIssuer = rfcIssuer;
        this.rfcReceiver = rfcReceiver;
    }

    public getRfcSigner(): string {
        return this.rfcSigner;
    }

    public getRfcIssuer(): string {
        return this.rfcIssuer;
    }

    public getRfcReceiver(): string {
        return this.rfcReceiver;
    }
}

import { RequestBuilderException } from "../request-builder-exception";

export class RfcIsNotIssuerOrReceiverException extends RequestBuilderException {

    private _rfcSigner: string;
    private _rfcIssuer: string;
    private _rfcReceiver: string;

    constructor(rfcSigner: string, rfcIssuer: string, rfcReceiver: string) {
        super(`The RFC "${rfcSigner}" must be the issuer "${rfcIssuer}" or receiver "${rfcReceiver}"`);
        this._rfcSigner = rfcSigner;
        this._rfcIssuer = rfcIssuer;
        this._rfcReceiver = rfcReceiver;
    }

    public getRfcSigner(): string {
        return this._rfcSigner;
    }

    public getRfcIssuer(): string {
        return this._rfcIssuer;
    }

    public getRfcReceiver(): string {
        return this._rfcReceiver;
    }
}

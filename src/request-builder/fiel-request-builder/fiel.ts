import { SignatureAlgorithm, Credential } from '@nodecfdi/credentials';

/**
 * Defines a eFirma/FIEL/FEA
 * This object is based on nodecfdi/credentials Credential object
 *
 * @see Credential
 */
export class Fiel {
    constructor(private _credential: Credential) {}

    public static create(certificateContents: string, privateKeyContents: string, passPhrase: string): Fiel {
        const credential = Credential.create(certificateContents, privateKeyContents, passPhrase);

        return new Fiel(credential);
    }

    public sign(toSign: string, algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA1): string {
        return this._credential.sign(toSign, algorithm);
    }

    public isValid(): boolean {
        if (!this._credential.certificate().satType().isFiel()) {
            return false;
        }
        if (!this._credential.certificate().validOn()) {
            return false;
        }

        return true;
    }

    public getCertificatePemContents(): string {
        return this._credential.certificate().pem();
    }

    public getRfc(): string {
        return this._credential.rfc();
    }

    public getCertificateSerial(): string {
        return this._credential.certificate().serialNumber().decimal();
    }

    /** missing function this.credential.certificate().issuerAsRfc4514() */
    public getCertificateIssuerName(): string {
        return this._credential.certificate().issuerAsRfc4514();
    }
}

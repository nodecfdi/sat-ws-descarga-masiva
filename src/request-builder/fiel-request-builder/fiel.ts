import { SignatureAlgorithm, Credential } from '@nodecfdi/credentials';

/**
 * Defines a eFirma/FIEL/FEA
 * This object is based on nodecfdi/credentials Credential object
 *
 * @see Credential
 */
export class Fiel {
    private credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    public static create(certificateContents: string, privateKeyContents: string, passPhrase: string): Fiel {
        const credential = Credential.create(certificateContents, privateKeyContents, passPhrase);
        return new Fiel(credential);
    }

    public sign(toSign: string, algorithm: SignatureAlgorithm.SHA1withRSA): string {
        return this.credential.sign(toSign, algorithm);
    }

    public isValid(): boolean {
        if (!this.credential.certificate().satType().isFiel()) {
            return false;
        }
        if (!this.credential.certificate().validOn()) {
            return false;
        }
        return true;
    }

    public getCertificatePemContents(): string {
        return this.credential.certificate().pem();
    }

    public getRfc(): string {
        return this.credential.rfc();
    }

    public getCertificateSerial(): string {
        return this.credential.certificate().serialNumber().decimal();
    }

    /** missing function this.credential.certificate().issuerAsRfc4514() */
    public getCertificateIssuerName(): string {
        return this.credential.certificate().issuerAsRfc4514();
    }
}

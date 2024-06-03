import { Credential } from '@nodecfdi/credentials';

/**
 * Defines a eFirma/FIEL/FEA
 * This object is based on nodecfdi/credentials Credential object
 *
 * @see Credential
 */
export class Fiel {
  public constructor(private readonly _credential: Credential) {}

  /**
   * Create a Fiel based on certificate and private key contents
   */
  public static create(
    certificateContents: string,
    privateKeyContents: string,
    passPhrase: string,
  ): Fiel {
    const credential = Credential.create(certificateContents, privateKeyContents, passPhrase);

    return new Fiel(credential);
  }

  public sign(toSign: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'): string {
    return this._credential.sign(toSign, algorithm);
  }

  public isValid(): boolean {
    if (!this._credential.certificate().satType().isFiel()) {
      return false;
    }

    return this._credential.certificate().validOn();
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

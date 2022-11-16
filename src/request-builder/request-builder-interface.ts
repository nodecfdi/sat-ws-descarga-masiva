import { DateTime } from '~/shared/date-time';
/**
 * The implementors must create the request signed ready to send to the SAT Web Service Descarga Masiva
 * The information about owner like RFC, certificate, private key, etc. are outside the scope of this interface
 */
export interface RequestBuilderInterface {
    /**
     * Creates an authorization signed xml message
     *
     * @param created - must use SAT format 'Y-m-dTH:i:s.000T'
     * @param expires - must use SAT format 'Y-m-dTH:i:s.000T'
     * @param securityTokenId - if empty, the authentication method will create one by its own
     * @returns string
     */
    authorization(created: DateTime, expires: DateTime, securityTokenId: string): string;

    /**
     * Creates a query signed xml message
     *
     * @param start - must use format 'Y-m-dTH:i:s'
     * @param end - must use format 'Y-m-dTH:i:s'
     * @param rfcIssuer - can be empty if $rfcReceiver is set, USE_SIGNER to use certificate owner
     * @param rfcReceiver - can be empty if $rfcIssuer is set, USE_SIGNER to use certificate owner
     * @param requestType - one of "CFDI" or "metadata"
     * @throws RequestBuilderException
     * @returns string
     */
    query(start: string, end: string, rfcIssuer: string, rfcReceiver: string, requestType: string): string;

    /**
     * Creates a verify signed xml message
     *
     * @param requestId - RequestId
     * @returns string
     */
    verify(requestId: string): string;

    /**
     * Creates a download signed xml message
     *
     * @param packageId - PackageId
     * @returns string
     */
    download(packageId: string): string;
}

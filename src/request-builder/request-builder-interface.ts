/**
 * The implementors must create the request signed ready to send to the SAT Web Service Descarga Masiva
 * The information about owner like RFC, certificate, private key, etc. are outside the scope of this interface
 */
export interface RequestBuilderInterface {
    USE_SIGNER: '*';

    /**
     * Creates an authorization signed xml message
     *
     * @param created must use SAT format 'Y-m-d\TH:i:s.000T'
     * @param expires must use SAT format 'Y-m-d\TH:i:s.000T'
     * @param securityTokenId if empty, the authentication method will create one by its own
     * @return string
     */
    authorization(created: string, expires: string, securityTokenId?: string): string;
    /**
     * Creates a query signed xml message
     *
     * @param start must use format 'Y-m-d\TH:i:s'
     * @param end must use format 'Y-m-d\TH:i:s'
     * @param rfcIssuer can be empty if $rfcReceiver is set, USE_SIGNER to use certificate owner
     * @param rfcReceiver can be empty if $rfcIssuer is set, USE_SIGNER to use certificate owner
     * @param requestType one of "CFDI" or "metadata"
     * @throws RequestBuilderException
     * @return string
     */
    query(start: string, end: string, rfcIssuer: string, rfcReceiver: string, requestType: string): string;
    /**
     * Creates a verify signed xml message
     *
     * @param requestId
     * @return string
     */
    verify(requestId: string): string;
    /**
     * Creates a download signed xml message
     *
     * @param packageId
     * @return string
     */
    download(packageId: string): string;
}

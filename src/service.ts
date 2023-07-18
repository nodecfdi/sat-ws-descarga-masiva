import { ServiceConsumer } from './internal/service-consumer';
import { type RequestBuilderInterface } from './request-builder/request-builder-interface';
import { AuthenticateTranslator } from './services/authenticate/authenticate-translator';
import { type DownloadResult } from './services/download/download-result';
import { DownloadTranslator } from './services/download/download-translator';
import { type QueryParameters } from './services/query/query-parameters';
import { type QueryResult } from './services/query/query-result';
import { QueryTranslator } from './services/query/query-translator';
import { type VerifyResult } from './services/verify/verify-result';
import { VerifyTranslator } from './services/verify/verify-translator';
import { ServiceEndpoints } from './shared/service-endpoints';
import { type Token } from './shared/token';
import { type WebClientInterface } from './web-client/web-client-interface';

export class Service {
    private readonly _endpoints: ServiceEndpoints;

    /**
     * Client constructor of "servicio de consulta y recuperación de comprobantes"
     *
     * @param endpoints - endpoints If undefined uses CFDI endpoints
     */
    constructor(
        private readonly _requestBuilder: RequestBuilderInterface,
        private readonly _webClient: WebClientInterface,
        public _currentToken?: Token,
        endpoints?: ServiceEndpoints,
    ) {
        this._endpoints = endpoints ?? ServiceEndpoints.cfdi();
    }

    /**
     * This method will reuse the current token,
     * it will create a new one if there is none or the current token is no longer valid
     */
    public async obtainCurrentToken(): Promise<Token> {
        if (!this._currentToken?.isValid()) {
            this._currentToken = await this.authenticate();
        }

        return this._currentToken;
    }

    /**
     * Perform authentication and return a Token, the token might be invalid
     */
    public async authenticate(): Promise<Token> {
        const authenticateTranslator = new AuthenticateTranslator();
        const soapBody = authenticateTranslator.createSoapRequest(this._requestBuilder);
        const responseBody = await this.consume(
            'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica',
            this._endpoints.getAuthenticate(),
            soapBody,
        );

        return authenticateTranslator.createTokenFromSoapResponse(responseBody);
    }

    /**
     * Consume the "SolicitaDescarga" web service
     */
    public async query(parameters: QueryParameters): Promise<QueryResult> {
        // fix parameters service type
        if (!parameters.hasServiceType()) {
            parameters = parameters.withServiceType(this._endpoints.getServiceType());
        }

        if (!this._endpoints.getServiceType().equalTo(parameters.getServiceType())) {
            throw new Error(
                `The service type endpoints ${parameters
                    .getServiceType()
                    .value()} does not match with the service type query ${this._endpoints.getServiceType().value()}`,
            );
        }

        const queryTranslator = new QueryTranslator();
        const soapBody = queryTranslator.createSoapRequest(this._requestBuilder, parameters);

        const currentToken = await this.obtainCurrentToken();
        const responseBody = await this.consume(
            'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga',
            this._endpoints.getQuery(),
            soapBody,
            currentToken,
        );

        return queryTranslator.createQueryResultFromSoapResponse(responseBody);
    }

    /**
     * Consume the "VerificaSolicitudDescarga" web service
     */
    public async verify(requestId: string): Promise<VerifyResult> {
        const verifyTranslator = new VerifyTranslator();
        const soapBody = verifyTranslator.createSoapRequest(this._requestBuilder, requestId);
        const currentToken = await this.obtainCurrentToken();
        const responseBody = await this.consume(
            'http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga',
            this._endpoints.getVerify(),
            soapBody,
            currentToken,
        );

        return verifyTranslator.createVerifyResultFromSoapResponse(responseBody);
    }

    public async download(packageId: string): Promise<DownloadResult> {
        const downloadTranslator = new DownloadTranslator();
        const soapBody = downloadTranslator.createSoapRequest(this._requestBuilder, packageId);
        const currentToken = await this.obtainCurrentToken();
        const responseBody = await this.consume(
            'http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar',
            this._endpoints.getDownload(),
            soapBody,
            currentToken,
        );

        return downloadTranslator.createDownloadResultFromSoapResponse(responseBody);
    }

    private async consume(soapAction: string, uri: string, body: string, token?: Token): Promise<string> {
        return ServiceConsumer.consume(this._webClient, soapAction, uri, body, token);
    }
}

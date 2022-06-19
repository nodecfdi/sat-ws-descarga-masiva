import { ServiceConsumer } from './internal/service-consumer';
import { RequestBuilderInterface } from './request-builder/request-builder-interface';
import { AuthenticateTranslator } from './services/authenticate/authenticate-translator';
import { DownloadResult } from './services/download/download-result';
import { DownloadTranslator } from './services/download/download-translator';
import { QueryParameters } from './services/query/query-parameters';
import { QueryResult } from './services/query/query-result';
import { QueryTranslator } from './services/query/query-translator';
import { VerifyResult } from './services/verify/verify-result';
import { VerifyTranslator } from './services/verify/verify-translator';
import { ServiceEndpoints } from './shared/service-endpoints';
import { Token } from './shared/token';
import { WebClientInterface } from './web-client/web-client-interface';

export class Service {
    private _requestBuilder: RequestBuilderInterface;

    private _webClient: WebClientInterface;

    public _currentToken?: Token;

    private _endpoints: ServiceEndpoints;

    /**
     * Client constructor of "servicio de consulta y recuperación de comprobantes"
     *
     * @param endpoints - endpoints If undefined uses CFDI endpoints
     */
    constructor(
        requestBuilder: RequestBuilderInterface,
        webClient: WebClientInterface,
        currentToken?: Token,
        endpoints?: ServiceEndpoints
    ) {
        this._requestBuilder = requestBuilder;
        this._webClient = webClient;
        this._currentToken = currentToken;
        this._endpoints = endpoints ?? ServiceEndpoints.cfdi();
    }

    /**
     * This method will reuse the current token,
     * it will create a new one if there is none or the current token is no longer valid
     */
    public async obtainCurrentToken(): Promise<Token> {
        if (!this._currentToken || !this._currentToken.isValid()) {
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
            soapBody
        );

        return authenticateTranslator.createTokenFromSoapResponse(responseBody);
    }

    /**
     * Consume the "SolicitaDescarga" web service
     */
    public async query(parameters: QueryParameters): Promise<QueryResult> {
        const queryTranslator = new QueryTranslator();
        const soapBody = queryTranslator.createSoapRequest(this._requestBuilder, parameters);

        const currentToken = await this.obtainCurrentToken();
        const responseBody = await this.consume(
            'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga',
            this._endpoints.getQuery(),
            soapBody,
            currentToken
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
            currentToken
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
            currentToken
        );

        return downloadTranslator.createDownloadResultFromSoapResponse(responseBody);
    }

    private async consume(soapAction: string, uri: string, body: string, token?: Token): Promise<string> {
        return await ServiceConsumer.consume(this._webClient, soapAction, uri, body, token);
    }
}

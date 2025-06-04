import { ServiceConsumer } from './internal/service_consumer.js';
import { type RequestBuilderInterface } from './request_builder/request_builder_interface.js';
import { AuthenticateTranslator } from './services/authenticate/authenticate_translator.js';
import { type DownloadResult } from './services/download/download_result.js';
import { DownloadTranslator } from './services/download/download_translator.js';
import { type QueryParameters } from './services/query/query_parameters.js';
import { type QueryResult } from './services/query/query_result.js';
import { QueryTranslator } from './services/query/query_translator.js';
import { type VerifyResult } from './services/verify/verify_result.js';
import { VerifyTranslator } from './services/verify/verify_translator.js';
import { ServiceEndpoints } from './shared/service_endpoints.js';
import { Token } from './shared/token.js';
import { type WebClientInterface } from './web_client/web_client_interface.js';

export class Service {
  public readonly endpoints: ServiceEndpoints;

  private _currentToken: Token;

  /**
   * Client constructor of "servicio de consulta y recuperación de comprobantes"
   *
   * @param endpoints - endpoints If undefined uses CFDI endpoints
   */
  public constructor(
    private readonly _requestBuilder: RequestBuilderInterface,
    private readonly _webClient: WebClientInterface,
    _currentToken: Token | null = null,
    endpoints: ServiceEndpoints | null = null,
  ) {
    this._currentToken = _currentToken ?? Token.empty();
    this.endpoints = endpoints ?? ServiceEndpoints.cfdi();
  }

  /**
   * This method will reuse the current token,
   * it will create a new one if there is none or the current token is no longer valid
   */
  public async obtainCurrentToken(): Promise<Token> {
    if (!this._currentToken.isValid()) {
      this._currentToken = await this.authenticate();
    }

    return this._currentToken;
  }

  public getToken(): Token {
    return this._currentToken;
  }

  public setToken(token: Token): void {
    this._currentToken = token;
  }

  /**
   * Perform authentication and return a Token, the token might be invalid
   */
  public async authenticate(): Promise<Token> {
    const authenticateTranslator = new AuthenticateTranslator();
    const soapBody = authenticateTranslator.createSoapRequest(this._requestBuilder);
    const responseBody = await this.consume(
      'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica',
      this.endpoints.getAuthenticate(),
      soapBody,
    );

    return authenticateTranslator.createTokenFromSoapResponse(responseBody);
  }

  /**
   * Consume the "SolicitaDescarga" web service
   */
  public async query(parameters: QueryParameters): Promise<QueryResult> {
    let defaultParameters = parameters;

    if (!this.endpoints.getServiceType().equalTo(defaultParameters.getServiceType())) {
      defaultParameters = defaultParameters.withServiceType(this.endpoints.getServiceType());
    }

    const queryTranslator = new QueryTranslator();
    const soapBody = queryTranslator.createSoapRequest(this._requestBuilder, defaultParameters);
    const soapAction = this.resolveSoapAction(defaultParameters);

    const currentToken = await this.obtainCurrentToken();
    const responseBody = await this.consume(
      `http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/${soapAction}`,
      this.endpoints.getQuery(),
      soapBody,
      currentToken,
    );

    return queryTranslator.createQueryResultFromSoapResponse(responseBody);
  }

  private resolveSoapAction(parameters: QueryParameters): string {
    if (!parameters.getUuid().isEmpty()) {
      return 'SolicitaDescargaFolio';
    }

    return parameters.getDownloadType().isTypeOf('received')
      ? 'SolicitaDescargaRecibidos'
      : 'SolicitaDescargaEmitidos';
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
      this.endpoints.getVerify(),
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
      this.endpoints.getDownload(),
      soapBody,
      currentToken,
    );

    return downloadTranslator.createDownloadResultFromSoapResponse(responseBody);
  }

  private async consume(
    soapAction: string,
    uri: string,
    body: string,
    token?: Token,
  ): Promise<string> {
    return ServiceConsumer.consume(this._webClient, soapAction, uri, body, token);
  }
}

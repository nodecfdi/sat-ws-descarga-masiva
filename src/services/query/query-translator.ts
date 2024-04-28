import { InteractsXmlTrait } from '../../internal/interacts-xml-trait.js';
import { type RequestBuilderInterface } from '../../request-builder/request-builder-interface.js';
import { StatusCode } from '../../shared/status-code.js';
import { type QueryParameters } from './query-parameters.js';
import { QueryResult } from './query-result.js';

export class QueryTranslator extends InteractsXmlTrait {
  public createQueryResultFromSoapResponse(content: string): QueryResult {
    const env = this.readXmlElement(content);

    const values = this.findAtrributes(
      env,
      'body',
      'solicitaDescargaResponse',
      'solicitaDescargaResult',
    );
    const status = new StatusCode(Number(values.codestatus), values.mensaje);
    const requestId = values.idsolicitud;

    return new QueryResult(status, requestId);
  }

  public createSoapRequest(
    requestBuilder: RequestBuilderInterface,
    parameters: QueryParameters,
  ): string {
    return requestBuilder.query(parameters);
  }
}

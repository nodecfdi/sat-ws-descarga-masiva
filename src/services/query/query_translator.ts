import { InteractsXmlTrait } from '../../internal/interacts_xml_trait.js';
import { type RequestBuilderInterface } from '../../request_builder/request_builder_interface.js';
import { StatusCode } from '../../shared/status_code.js';
import { type QueryParameters } from './query_parameters.js';
import { QueryResult } from './query_result.js';

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

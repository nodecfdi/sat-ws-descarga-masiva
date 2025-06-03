import { type Element } from '@nodecfdi/cfdi-core';
import { InteractsXmlTrait } from '#src/internal/interacts_xml_trait';
import { type RequestBuilderInterface } from '#src/request_builder/request_builder_interface';
import { StatusCode } from '#src/shared/status_code';
import { type QueryParameters } from './query_parameters.js';
import { QueryResult } from './query_result.js';

export class QueryTranslator extends InteractsXmlTrait {
  private resolveResponsePath(envelope: Element): string[] {
    if (this.findElement(envelope, 'body', 'solicitaDescargaEmitidosResponse')) {
      return ['body', 'solicitaDescargaEmitidosResponse', 'solicitaDescargaEmitidosResult'];
    }
    if (this.findElement(envelope, 'body', 'solicitaDescargaRecibidosResponse')) {
      return ['body', 'solicitaDescargaRecibidosResponse', 'solicitaDescargaRecibidosResult'];
    }
    if (this.findElement(envelope, 'body', 'SolicitaDescargaFolioResponse')) {
      return ['body', 'SolicitaDescargaFolioResponse', 'SolicitaDescargaFolioResult'];
    }

    return [];
  }

  public createQueryResultFromSoapResponse(content: string): QueryResult {
    const env = this.readXmlElement(content);
    const path = this.resolveResponsePath(env);

    const values = this.findAtrributes(env, ...path);
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

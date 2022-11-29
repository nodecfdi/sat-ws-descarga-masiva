import { InteractsXmlTrait } from '../../internal/interacts-xml-trait';
import { RequestBuilderInterface } from '../../request-builder/request-builder-interface';
import { StatusCode } from '../../shared/status-code';
import { QueryParameters } from './query-parameters';
import { QueryResult } from './query-result';

export class QueryTranslator extends InteractsXmlTrait {
    public createQueryResultFromSoapResponse(content: string): QueryResult {
        const env = this.readXmlElement(content);

        const values = this.findAtrributes(env, 'body', 'solicitaDescargaResponse', 'solicitaDescargaResult');
        const status = new StatusCode(Number(values['codestatus']) ?? 0, values['mensaje'] ?? '');
        const requestId = values['idsolicitud'] ?? '';

        return new QueryResult(status, requestId);
    }

    public createSoapRequest(requestBuilder: RequestBuilderInterface, parameters: QueryParameters): string {
        return requestBuilder.query(parameters);
    }
}

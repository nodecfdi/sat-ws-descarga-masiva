import { use } from 'typescript-mix';
import { InteractsXmlTrait } from '../../internal/interacts-xml-trait';
import { RequestBuilderInterface } from '../../request-builder/request-builder-interface';
import { DownloadType } from '../../shared/download-type';
import { StatusCode } from '../../shared/status-code';
import { QueryParameters } from './query-parameters';
import { QueryResult } from './query-result';

export class QueryTranslator extends InteractsXmlTrait {
    @use(InteractsXmlTrait) private this: unknown;

    public createQueryResultFromSoapResponse(content: string): QueryResult {
        const env = this.readXmlElement(content);

        const values = this.findAtrributes(env, 'body', 'solicitaDescargaResponse', 'solicitaDescargaResult');
        const status = new StatusCode(Number(values['codestatus']) ?? 0, values['mensaje'] ?? '');
        const requestId = values['idsolicitud'] ?? '';
        return new QueryResult(status, requestId);
    }

    public createSoapRequest(requestBuilder: RequestBuilderInterface, parameters: QueryParameters): string {
        const start = parameters.getPeriod().getStart().format(`yyyy-MM-dd'T'HH:mm:ss`);
        const end = parameters.getPeriod().getEnd().format(`yyyy-MM-dd'T'HH:mm:ss`);
        const rfcIssuer = parameters.getDownloadType() == DownloadType.issued ? requestBuilder.USE_SIGNER : parameters.getRfcMatch();
        const rfcReceiver = parameters.getDownloadType() == DownloadType.received ? requestBuilder.USE_SIGNER : parameters.getRfcMatch();
        const requestType = parameters.getRequestType().valueOf();

        return requestBuilder.query(start, end, rfcIssuer, rfcReceiver, requestType);
    }
}

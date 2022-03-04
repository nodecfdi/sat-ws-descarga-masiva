import { use } from 'typescript-mix';
import { InteractsXmlTrait } from '../../internal/interacts-xml-trait';
import { RequestBuilderInterface } from '../../request-builder/request-builder-interface';
import { StatusCode } from '../../shared/status-code';
import { DownloadResult } from './download-result';

export class DownloadTranslator extends InteractsXmlTrait {
    @use(InteractsXmlTrait) private this: unknown;

    public createDownloadResultFromSoapResponse(content: string): DownloadResult {
        const env = this.readXmlElement(content);
        const values = this.findAtrributes(env, 'header', 'respuesta');
        
        const status = new StatusCode(Number(values['codestatus']) ?? 0, values['mensaje'] ?? '');
        const cpackage = this.findContent(env, 'body', 'RespuestaDescargaMasivaTercerosSalida', 'Paquete');
        return new DownloadResult(status, Buffer.from(cpackage).toString('base64') || '');
    }

    public createSoapRequest(requestBuilder: RequestBuilderInterface, packageId: string): string {
        return requestBuilder.download(packageId);
    }
}

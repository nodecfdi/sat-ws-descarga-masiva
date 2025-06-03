import { InteractsXmlTrait } from '#src/internal/interacts_xml_trait';
import { type RequestBuilderInterface } from '#src/request_builder/request_builder_interface';
import { StatusCode } from '#src/shared/status_code';
import { DownloadResult } from './download_result.js';

export class DownloadTranslator extends InteractsXmlTrait {
  public createDownloadResultFromSoapResponse(content: string): DownloadResult {
    const env = this.readXmlElement(content);
    const values = this.findAtrributes(env, 'header', 'respuesta');

    const status = new StatusCode(Number(values.codestatus), values.mensaje);
    const cpackage = this.findContent(
      env,
      'body',
      'RespuestaDescargaMasivaTercerosSalida',
      'Paquete',
    );

    return new DownloadResult(status, Buffer.from(cpackage).toString() || '');
  }

  public createSoapRequest(requestBuilder: RequestBuilderInterface, packageId: string): string {
    return requestBuilder.download(packageId);
  }
}

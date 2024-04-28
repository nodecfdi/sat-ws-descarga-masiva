import { InteractsXmlTrait } from '../../internal/interacts-xml-trait.js';
import { type RequestBuilderInterface } from '../../request-builder/request-builder-interface.js';
import { CodeRequest } from '../../shared/code-request.js';
import { StatusCode } from '../../shared/status-code.js';
import { StatusRequest } from '../../shared/status-request.js';
import { VerifyResult } from './verify-result.js';

export class VerifyTranslator extends InteractsXmlTrait {
  public createVerifyResultFromSoapResponse(content: string): VerifyResult {
    const env = this.readXmlElement(content);

    const values = this.findAtrributes(
      env,
      'body',
      'VerificaSolicitudDescargaResponse',
      'VerificaSolicitudDescargaResult',
    );
    const status = new StatusCode(Number(values.codestatus), values.mensaje);
    const statusRequest = new StatusRequest(Number(values.estadosolicitud));

    const codeRequest = new CodeRequest(Number(values.codigoestadosolicitud));
    const numberCfdis = Number(values.numerocfdis);
    const packages = this.findContents(
      env,
      'body',
      'VerificaSolicitudDescargaResponse',
      'VerificaSolicitudDescargaResult',
      'IdsPaquetes',
    );

    return new VerifyResult(status, statusRequest, codeRequest, numberCfdis, ...packages);
  }

  public createSoapRequest(requestBuilder: RequestBuilderInterface, requestId: string): string {
    return requestBuilder.verify(requestId);
  }
}

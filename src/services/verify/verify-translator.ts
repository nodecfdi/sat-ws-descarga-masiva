import { use } from 'typescript-mix';
import { InteractsXmlTrait } from '../../internal/interacts-xml-trait';
import { RequestBuilderInterface } from '../../request-builder/request-builder-interface';
import { CodeRequest } from '../../shared/code-request';
import { StatusCode } from '../../shared/status-code';
import { StatusRequest } from '../../shared/status-request';
import { VerifyResult } from './verify-result';

export class VerifyTranslator extends InteractsXmlTrait {
    @use(InteractsXmlTrait) private this: unknown;

    public createVerifyResultFromSoapResponse(content: string): VerifyResult {
        const env = this.readXmlElement(content);

        const values = this.findAtrributes(
            env,
            ...['body', 'VerificaSolicitudDescargaResponse', 'VerificaSolicitudDescargaResult']
        );
        const status = new StatusCode(Number(values['codestatus']) ?? 0, values['mensaje'] ?? '');
        const statusRequest = new StatusRequest(Number(values['estadosolicitud']) ?? 0);

        const codeRequest = new CodeRequest(Number(values['codigoestadosolicitud'] ?? 0));
        const numberCfdis = Number(values['numerocfdis']) ?? 0;
        const packages = this.findContents(
            env,
            ...['body', 'VerificaSolicitudDescargaResponse', 'VerificaSolicitudDescargaResult', 'IdsPaquetes']
        );

        return new VerifyResult(status, statusRequest, codeRequest, numberCfdis, ...packages);
    }

    public createSoapRequest(requestBuilder: RequestBuilderInterface, requestId: string): string {
        return requestBuilder.verify(requestId);
    }
}

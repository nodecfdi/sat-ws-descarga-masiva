import { use } from 'typescript-mix';
import { SoapFaultInfo } from '../web-client/soap-fault-info';
import { InteractsXmlTrait } from './interacts-xml-trait';

export class SoapFaultInfoExtractor extends InteractsXmlTrait {
    @use(InteractsXmlTrait) private this: unknown;

    public static extract(source: string): SoapFaultInfo | undefined {
        return new SoapFaultInfoExtractor().obtainFault(source);
    }

    public obtainFault(source: string): SoapFaultInfo | undefined {
        let env: Element;
        try {
            env = this.readXmlElement(source);
        } catch (error) {
            return;
        }
        const code = (this.findElement(env, 'body', 'fault', 'faultcode')?.textContent ?? '').trim();
        const message = (this.findElement(env,  'body', 'fault', 'faultstring')?.textContent ?? '').trim();
        if(code == '' && message == '') {
            return;
        }
        return new SoapFaultInfo(code, message);
    }
}

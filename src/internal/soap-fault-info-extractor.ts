import { SoapFaultInfo } from '../web-client/soap-fault-info.js';
import { InteractsXmlTrait } from './interacts-xml-trait.js';

export class SoapFaultInfoExtractor extends InteractsXmlTrait {
  public static extract(source: string): SoapFaultInfo | undefined {
    return new SoapFaultInfoExtractor().obtainFault(source);
  }

  public obtainFault(source: string): SoapFaultInfo | undefined {
    let env: Element;
    try {
      env = this.readXmlElement(source);
    } catch {
      return;
    }

    const code = (this.findElement(env, 'body', 'fault', 'faultcode')?.textContent ?? '').trim();
    const message = (
      this.findElement(env, 'body', 'fault', 'faultstring')?.textContent ?? ''
    ).trim();
    if (code === '' && message === '') {
      return;
    }

    return new SoapFaultInfo(code, message);
  }
}

import { SoapFaultInfo } from '#src/web_client/soap_fault_info';
import { InteractsXmlTrait } from './interacts_xml_trait.js';

export class SoapFaultInfoExtractor extends InteractsXmlTrait {
  public static extract(source: string): SoapFaultInfo | undefined {
    return new SoapFaultInfoExtractor().obtainFault(source);
  }

  public obtainFault(source: string): SoapFaultInfo | undefined {
    let env: Element;
    try {
      // @ts-expect-error misssing Node properties are not needed
      env = this.readXmlElement(source);
    } catch {
      return;
    }
    // @ts-expect-error misssing Node properties are not needed
    const code = (this.findElement(env, 'body', 'fault', 'faultcode')?.textContent ?? '').trim();
    const message = // @ts-expect-error misssing Node properties are not needed
      (this.findElement(env, 'body', 'fault', 'faultstring')?.textContent ?? '').trim();
    if (code === '' && message === '') {
      return;
    }

    return new SoapFaultInfo(code, message);
  }
}

import { BaseEnum } from './enum/base_enum.js';
import { type ServiceType } from './service_type.js';

export type RequestTypeTypes = 'xml' | 'metadata';

enum RequestTypeEnum {
  xml = 'xml',
  metadata = 'metadata',
}

export class RequestType extends BaseEnum<RequestTypeTypes> {
  public getQueryAttributeValue(serviceType: ServiceType): string {
    if (this.isTypeOf('xml') && serviceType.isTypeOf('cfdi')) {
      return 'CFDI';
    }

    if (this.isTypeOf('xml') && serviceType.isTypeOf('retenciones')) {
      return 'Retencion';
    }

    return 'Metadata';
  }

  public value(): string {
    return RequestTypeEnum[this._id];
  }
}

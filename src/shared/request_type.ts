import { BaseEnum } from './enum/base_enum.js';

export type RequestTypeTypes = 'xml' | 'metadata';

export const RequestTypeEnum = {
  xml: 'xml',
  metadata: 'metadata',
};

export class RequestType extends BaseEnum<RequestTypeTypes> {
  public getQueryAttributeValue(): string {
    return this.isTypeOf('xml') ? 'CFDI' : 'Metadata';
  }

  public value(): string {
    return RequestTypeEnum[this._id];
  }
}

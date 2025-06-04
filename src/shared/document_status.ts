import { BaseEnum } from './enum/base_enum.js';

export type DocumentStatusTypes = 'undefined' | 'active' | 'cancelled';

export const DocumentStatusEnum = {
  undefined: '',
  active: '1',
  cancelled: '0',
} as const;

export class DocumentStatus extends BaseEnum<DocumentStatusTypes> {
  public value(): string {
    return DocumentStatusEnum[this._id];
  }

  public getQueryAttributeValue(): string {
    if (this.isTypeOf('undefined')) {
      return 'Todos';
    }
    if (this.isTypeOf('active')) {
      return 'Vigente';
    }
    if (this.isTypeOf('cancelled')) {
      return 'Cancelado';
    }
    throw new Error('Impossible case');
  }

  public override toJSON(): string {
    return DocumentStatusEnum[this._id];
  }
}

import { BaseEnum } from './enum/base_enum.js';

export type DocumentTypeTypes = 'undefined' | 'ingreso' | 'egreso' | 'traslado' | 'nomina' | 'pago';

export const DocumentTypeEnum = {
  undefined: '',
  ingreso: 'I',
  egreso: 'E',
  traslado: 'T',
  nomina: 'N',
  pago: 'P',
} as const;

export class DocumentType extends BaseEnum<DocumentTypeTypes> {
  public value(): string {
    return DocumentTypeEnum[this._id];
  }

  public override toJSON(): string {
    return DocumentTypeEnum[this._id];
  }
}

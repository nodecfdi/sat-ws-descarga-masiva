import { BaseEnum } from './enum/base-enum';

type DocumentStatusTypes = 'undefined' | 'active' | 'cancelled';

enum DocumentStatusEnum {
    undefined = '',
    active = '1',
    cancelled = '0'
}

export class DocumentStatus extends BaseEnum<DocumentStatusTypes> {
    public value(): string {
        return DocumentStatusEnum[this._id];
    }
}

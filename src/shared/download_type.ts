import { BaseEnum } from './enum/base_enum.js';

export type DownloadTypeTypes = 'issued' | 'received';

enum DownloadTypeEnum {
  issued = 'RfcEmisor',
  received = 'RfcReceptor',
}

export class DownloadType extends BaseEnum<DownloadTypeTypes> {
  public value(): string {
    return DownloadTypeEnum[this._id];
  }

  public override toJSON(): string {
    return DownloadTypeEnum[this._id];
  }
}

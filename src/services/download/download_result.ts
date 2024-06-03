import { type StatusCode } from '../../shared/status_code.js';

export class DownloadResult {
  private readonly _packageSize: number;

  public constructor(
    private readonly _status: StatusCode,
    private readonly _packageContent: string,
  ) {
    this._packageSize = _packageContent.length;
  }

  /**
   * Status of the download call
   */
  public getStatus(): StatusCode {
    return this._status;
  }

  /**
   * If available, contains the package contents
   */
  public getPackageContent(): string {
    return this._packageContent;
  }

  /**
   * If available, contains the package contents length in bytesF
   */
  public getPackageSize(): number {
    return this._packageSize;
  }

  public toJSON(): { status: StatusCode; length: number } {
    return {
      status: this._status,
      length: this._packageSize,
    };
  }
}

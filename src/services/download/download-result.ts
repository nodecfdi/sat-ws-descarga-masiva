import { StatusCode } from '../../shared/status-code';

export class DownloadResult {
    private _status: StatusCode;
    private _packageContent: string;
    private _packageLength: number;

    constructor(statusCode: StatusCode, packageContent: string) {
        this._status = statusCode;
        this._packageContent = packageContent;
        this._packageLength = packageContent.length;
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
    public getPackageLenght(): number {
        return this._packageLength;
    }

    public jsonSerialize(): { status: StatusCode, length: number } {
        return {
            status: this._status,
            length: this._packageLength,
        };
    }
}

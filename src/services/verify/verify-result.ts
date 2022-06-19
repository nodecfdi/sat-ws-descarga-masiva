import { CodeRequest } from '../../shared/code-request';
import { StatusCode } from '../../shared/status-code';
import { StatusRequest } from '../../shared/status-request';

export class VerifyResult {
    private _status: StatusCode;

    private _statusRequest: StatusRequest;

    private _codeRequest: CodeRequest;

    private _numberCfdis: number;

    private _packagesIds: string[];

    constructor(
        statusCode: StatusCode,
        statusRequest: StatusRequest,
        codeRequest: CodeRequest,
        numberCfdis: number,
        ...packageIds: string[]
    ) {
        this._status = statusCode;
        this._statusRequest = statusRequest;
        this._codeRequest = codeRequest;
        this._numberCfdis = numberCfdis;
        this._packagesIds = packageIds;
    }

    /**
     * Status of the verification call
     */
    public getStatus(): StatusCode {
        return this._status;
    }

    /**
     * Status of the query
     */
    public getStatusRequest(): StatusRequest {
        return this._statusRequest;
    }

    /**
     * Code related to the status of the query
     */
    public getCodeRequest(): CodeRequest {
        return this._codeRequest;
    }

    /**
     * Number of CFDI given by the query
     */
    public getNumberCfdis(): number {
        return this._numberCfdis;
    }

    /**
     * An array containing the package identifications, required to perform the download process
     */
    public getPackageIds(): string[] {
        return this._packagesIds;
    }

    public countPackages(): number {
        return this._packagesIds.length;
    }

    public jsonSerialize(): {
        status: { code: number; message: string };
        codeRequest: { value: number | undefined; message: string };
        statusRequest: { value: number | undefined; message: string };
        numberCfdis: number;
        packagesIds: string[];
    } {
        return {
            status: this._status.jsonSerialize(),
            codeRequest: this._codeRequest.jsonSerialize(),
            statusRequest: this._statusRequest.jsonSerialize(),
            numberCfdis: this._numberCfdis,
            packagesIds: this._packagesIds
        };
    }
}

import { type CodeRequest } from '../../shared/code_request.js';
import { type StatusCode } from '../../shared/status_code.js';
import { type StatusRequest } from '../../shared/status_request.js';

export class VerifyResult {
  private readonly _status: StatusCode;

  private readonly _statusRequest: StatusRequest;

  private readonly _codeRequest: CodeRequest;

  private readonly _numberCfdis: number;

  private readonly _packagesIds: string[];

  public constructor(
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

  public toJSON(): {
    status: { code: number; message: string };
    codeRequest: { value: number | undefined; message: string };
    statusRequest: { value: number | undefined; message: string };
    numberCfdis: number;
    packagesIds: string[];
  } {
    return {
      status: this._status.toJSON(),
      codeRequest: this._codeRequest.toJSON(),
      statusRequest: this._statusRequest.toJSON(),
      numberCfdis: this._numberCfdis,
      packagesIds: this._packagesIds,
    };
  }
}

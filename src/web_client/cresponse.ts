export class CResponse {
  private readonly _statusCode: number;

  private readonly _body: string;

  private readonly _headers: Record<string, string>;

  static TIMEOUT_CODE = 1;

  public constructor(statuscode: number, body: string, headers: Record<string, string> = {}) {
    this._statusCode = statuscode;
    this._body = body;
    this._headers = headers;
  }

  static timeout(milliseconds?: number): CResponse {
    return new CResponse(
      CResponse.TIMEOUT_CODE,
      `Timeout after ${milliseconds ?? 'unknown'} ms`,
      {},
    );
  }

  public getStatusCode(): number {
    return this._statusCode;
  }

  public getBody(): string {
    return this._body;
  }

  public getHeaders(): Record<string, string> {
    return this._headers;
  }

  public isEmpty(): boolean {
    return this._body === '';
  }

  public statusCodeIsTimeoutError(): boolean {
    return this._statusCode === CResponse.TIMEOUT_CODE;
  }

  public statusCodeIsClientError(): boolean {
    return this._statusCode < 500 && this._statusCode >= 400;
  }

  public statusCodeIsServerError(): boolean {
    return this._statusCode < 600 && this._statusCode >= 500;
  }

  public toJSON(): {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  } {
    return {
      statusCode: this._statusCode,
      body: this._body,
      headers: this._headers,
    };
  }
}

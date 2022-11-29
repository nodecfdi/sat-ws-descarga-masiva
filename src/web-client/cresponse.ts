export class CResponse {
    private _statusCode: number;

    private _body: string;

    private _headers: Record<string, string>;

    constructor(statuscode: number, body: string, headers: Record<string, string> = {}) {
        this._statusCode = statuscode;
        this._body = body;
        this._headers = headers;
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
        return '' == this._body;
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
            headers: this._headers
        };
    }
}

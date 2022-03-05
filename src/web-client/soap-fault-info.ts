export class SoapFaultInfo {
    private _code: string;
    private _message: string;

    constructor(code: string, message: string) {
        this._code = code;
        this._message = message;
    }

    public getCode(): string {
        return this._code;
    }

    public getMessage(): string {
        return this._message;
    }

    public jsonSerialize(): { code: string, message: string } {
        return {
            code: this._code,
            message: this._message
        };
    }
}

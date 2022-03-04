export class StatusCode {
    private _code: number;
    private _message: string;

    constructor(code: number, message: string) {
        this._code = code;
        this._message = message;
    }

    public getCode(): number {
        return this._code;
    }

    public getMessage(): string {
        return this._message;
    }

    public isAccepted(): boolean {
        return (5000 == this._code);
    }

    public jsonSerialize(): { code: number, message: string } {
        return {
            code: this._code,
            message: this._message
        };
    }
}

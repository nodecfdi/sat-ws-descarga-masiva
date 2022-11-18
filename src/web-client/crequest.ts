import { Method } from 'axios';

export class CRequest {
    private _method: Method;

    private _uri: string;

    private _body: string;

    private _headers: Record<string, string>;

    /**
     *
     */
    constructor(method: Method, uri: string, body: string, headers: Record<string, string>) {
        this._method = method;
        this._uri = uri;
        this._body = body;
        const map = new Map([...Object.entries(this.defaultHeaders()), ...Object.entries(headers)]);
        this._headers = Object.fromEntries(map);
    }

    public getMethod(): Method {
        return this._method;
    }

    public getUri(): string {
        return this._uri;
    }

    public getBody(): string {
        return this._body;
    }

    public getHeaders(): Record<string, string> {
        return this._headers;
    }

    public defaultHeaders(): {
        'Content-type': string;
        'Accept': string;
        'Cache-Control': string;
    } {
        return {
            'Content-type': 'text/xml; charset="utf-8"',
            'Accept': 'text/xml',
            'Cache-Control': 'no-cache'
        };
    }

    public toJSON(): {
        method: string;
        uri: string;
        body: string;
        headers: Record<string, string>;
    } {
        return {
            method: this._method,
            uri: this._uri,
            body: this._body,
            headers: this._headers
        };
    }
}

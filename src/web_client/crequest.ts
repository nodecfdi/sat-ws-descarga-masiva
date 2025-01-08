export class CRequest {
  private readonly _method: string;

  private readonly _uri: string;

  private readonly _body: string;

  private readonly _headers: Record<string, string>;

  private readonly _timeout?: number;

  public constructor(
    method: string,
    uri: string,
    body: string,
    headers: Record<string, string>,
    timeout?: number,
  ) {
    this._method = method;
    this._uri = uri;
    this._body = body;
    const map = new Map([...Object.entries(this.defaultHeaders()), ...Object.entries(headers)]);
    this._headers = Object.fromEntries(map);
    this._timeout = timeout;
  }

  public getMethod(): string {
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

  public getTimeout(): number | undefined {
    return this._timeout;
  }

  public defaultHeaders(): {
    'Content-type': string;
    'Accept': string;
    'Cache-Control': string;
  } {
    return {
      'Content-type': 'text/xml; charset="utf-8"',
      'Accept': 'text/xml',
      'Cache-Control': 'no-cache',
    };
  }

  public toJSON(): {
    method: string;
    uri: string;
    body: string;
    headers: Record<string, string>;
    timeout?: number;
  } {
    return {
      method: this._method,
      uri: this._uri,
      body: this._body,
      headers: this._headers,
      timeout: this._timeout,
    };
  }
}

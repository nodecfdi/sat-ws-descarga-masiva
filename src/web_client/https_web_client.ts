import { type ClientRequest } from 'node:http';
import https from 'node:https';
import { type CRequest } from './crequest.js';
import { CResponse } from './cresponse.js';
import { WebClientException } from './exceptions/web_client_exception.js';
import { type WebClientInterface } from './web_client_interface.js';

export class HttpsWebClient implements WebClientInterface {
  private readonly _fireRequestClosure?: CallableFunction;

  private readonly _fireResponseClosure?: CallableFunction;

  private readonly _timeout?: number;

  public constructor(
    onFireRequest?: CallableFunction,
    onFireResponse?: CallableFunction,
    timeout?: number,
  ) {
    this._fireRequestClosure = onFireRequest;
    this._fireResponseClosure = onFireResponse;
    this._timeout = timeout;
  }

  public fireRequest(request: CRequest): void {
    if (this._fireRequestClosure) {
      this._fireRequestClosure(request);
    }
  }

  public fireResponse(response: CResponse): void {
    if (this._fireResponseClosure) {
      this._fireResponseClosure(response);
    }
  }

  public async call(request: CRequest): Promise<CResponse> {
    const options = {
      method: request.getMethod(),
      headers: request.getHeaders(),
      timeout: this._timeout ?? request.getTimeout() ?? undefined,
    };

    return new Promise((resolve, reject) => {
      let clientRequest: ClientRequest;
      try {
        clientRequest = https.request(request.getUri(), options, (response) => {
          const code = response.statusCode ?? 0;
          const body: Uint8Array[] = [];
          response.on('data', (chunk: Uint8Array) => body.push(chunk));
          response.on('end', () => {
            const responseString = Buffer.concat(body).toString();
            resolve(new CResponse(code, responseString));
          });
        });
      } catch (error) {
        const catchedError = error as Error;
        const errorResponse = new CResponse(0, catchedError.message, {});
        throw new WebClientException(catchedError.message, request, errorResponse);
      }

      clientRequest.on('error', (error) => {
        const errorResponse = new CResponse(0, error.message, {});
        reject(new WebClientException(error.message, request, errorResponse));
      });

      clientRequest.on('timeout', () => {
        clientRequest.destroy();
        const errorResponse = CResponse.timeout(this._timeout);

        const rejectReason =
          this._timeout === undefined
            ? new Error('Request time out')
            : new WebClientException('Request time out', request, errorResponse);

        reject(rejectReason);
      });

      clientRequest.write(request.getBody());
      clientRequest.end();
    });
  }
}

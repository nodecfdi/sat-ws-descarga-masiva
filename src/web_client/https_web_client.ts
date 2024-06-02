import { type ClientRequest } from 'node:http';
import https from 'node:https';
import { type CRequest } from './crequest.js';
import { CResponse } from './cresponse.js';
import { WebClientException } from './exceptions/web_client_exception.js';
import { type WebClientInterface } from './web_client_interface.js';

export class HttpsWebClient implements WebClientInterface {
  private readonly _fireRequestClosure?: CallableFunction;

  private readonly _fireResponseClosure?: CallableFunction;

  public constructor(onFireRequest?: CallableFunction, onFireResponse?: CallableFunction) {
    this._fireRequestClosure = onFireRequest;
    this._fireResponseClosure = onFireResponse;
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
        reject(new Error('Request time out'));
      });

      clientRequest.write(request.getBody());
      clientRequest.end();
    });
  }
}

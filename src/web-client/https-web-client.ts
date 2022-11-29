import { CRequest } from './crequest';
import { CResponse } from './cresponse';
import { WebClientInterface } from './web-client-interface';
import https from 'node:https';
import { WebClientException } from './exceptions/web-client-exception';
import { ClientRequest } from 'node:http';

export class HttpsWebClient implements WebClientInterface {
    private _fireRequestClosure?: CallableFunction;

    private _fireResponseClosure?: CallableFunction;

    constructor(onFireRequest?: CallableFunction, onFireResponse?: CallableFunction) {
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
            headers: request.getHeaders()
        };

        return new Promise((resolve, reject) => {
            let req: ClientRequest;
            try {
                req = https.request(request.getUri(), options, (res) => {
                    const code = res?.statusCode ?? 0;
                    const body: Uint8Array[] = [];
                    res.on('data', (chunk) => body.push(chunk));
                    res.on('end', () => {
                        const resString = Buffer.concat(body).toString();
                        resolve(new CResponse(code, resString));
                    });
                });
            } catch (error) {
                const err = error as Error;
                const errorResponse = new CResponse(0, err.message, {});
                throw new WebClientException(err.message, request, errorResponse);
            }

            req.on('error', (err) => {
                const errorResponse = new CResponse(0, err.message, {});
                reject(new WebClientException(err.message, request, errorResponse));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request time out'));
            });

            req.write(request.getBody());
            req.end();
        });
    }
}

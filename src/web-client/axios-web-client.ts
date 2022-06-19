import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { CRequest } from './crequest';
import { CResponse } from './cresponse';
import { WebClientException } from './exceptions/web-client-exception';
import { WebClientInterface } from './web-client-interface';

export class AxiosWebClient implements WebClientInterface {
    private _client: AxiosInstance;

    private _fireRequestClosure?: CallableFunction;

    private _fireResponseClosure?: CallableFunction;

    constructor(client?: AxiosInstance, onFireRequest?: CallableFunction, onFireResponse?: CallableFunction) {
        this._client = client ?? axios.create();
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
        let response: AxiosResponse;
        try {
            response = await this._client.request({
                method: request.getMethod(),
                headers: request.getHeaders(),
                data: request.getBody(),
                url: request.getUri()
            });
        } catch (error) {
            const axiosError = error as AxiosError<string>;
            const errorResponse = new CResponse(Number(axiosError.code) ?? 0, axiosError.response?.data ?? '', {});
            throw new WebClientException(axiosError.message, request, errorResponse, error as Error);
        }

        return new CResponse(response.status, response.data, response.headers);
    }
}

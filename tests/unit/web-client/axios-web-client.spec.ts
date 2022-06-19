/* eslint-disable jest/no-conditional-expect */
import { CRequest } from '../../../src/web-client/crequest';
import { AxiosWebClient } from '../../../src/web-client/axios-web-client';
import { WebClientException } from '../../../src/web-client/exceptions/web-client-exception';
import { CResponse } from '../../../src/web-client/cresponse';
describe('axios web client test', () => {
    test('call throws web exception', async () => {
        const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
        const webClient = new AxiosWebClient();
        let exception: WebClientException;
        try {
            await webClient.call(request);
        } catch (error) {
            exception = error as WebClientException;
            expect(exception).toBeInstanceOf(WebClientException);
            expect(exception.message).toBe('getaddrinfo ENOTFOUND invalid');
            expect(exception.getRequest()).toBe(request);
        }
    });

    test('fire request', () => {
        const captured: CRequest[] = [];
        const observer = (request: CRequest): void => {
            captured.push(request);
        };
        const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
        const webClient = new AxiosWebClient(undefined, observer);
        webClient.fireRequest(request);
        expect(captured[0]).toBe(request);
    });

    test('fire response', () => {
        const captured: CResponse[] = [];
        const observer = (response: CResponse): void => {
            captured.push(response);
        };
        const response = new CResponse(200, '', {});
        const webClient = new AxiosWebClient(undefined, undefined, observer);
        webClient.fireResponse(response);
        expect(captured[0]).toBe(response);
    });
});

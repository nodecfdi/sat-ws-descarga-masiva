import { CRequest } from '~/web-client/crequest';
import { HttpsWebClient } from '~/web-client/https-web-client';
import { WebClientException } from '~/web-client/exceptions/web-client-exception';
import { CResponse } from '~/web-client/cresponse';
describe('https web client test', () => {
    test('call throws web exception', async () => {
        const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
        const webClient = new HttpsWebClient();
        let exception: WebClientException;
        try {
            await webClient.call(request);
        } catch (error) {
            exception = error as WebClientException;
            // eslint-disable-next-line jest/no-conditional-expect
            expect(exception).toBeInstanceOf(WebClientException);
            // eslint-disable-next-line jest/no-conditional-expect
            expect(exception.getRequest()).toBe(request);

            return;
        }
        // if doesn't throw errors fails.
        expect(false).toBeTruthy();
    });

    test('fire request', () => {
        const captured: CRequest[] = [];
        const observer = (request: CRequest): void => {
            captured.push(request);
        };
        const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
        const webClient = new HttpsWebClient(observer);
        webClient.fireRequest(request);
        expect(captured[0]).toBe(request);
    });

    test('fire response', () => {
        const captured: CResponse[] = [];
        const observer = (response: CResponse): void => {
            captured.push(response);
        };
        const response = new CResponse(200, '', {});
        const webClient = new HttpsWebClient(undefined, observer);
        webClient.fireResponse(response);
        expect(captured[0]).toBe(response);
    });
});

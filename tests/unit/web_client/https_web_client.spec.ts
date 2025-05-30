import { CRequest } from '#src/web_client/crequest';
import { CResponse } from '#src/web_client/cresponse';
import { WebClientException } from '#src/web_client/exceptions/web_client_exception';
import { HttpsWebClient } from '#src/web_client/https_web_client';

describe('https web client test', () => {
  test('call throws web exception', async () => {
    const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
    const webClient = new HttpsWebClient();
    await expect(() => webClient.call(request)).rejects.toThrowError('Invalid URL');
  });

  test('call throws timeout', async () => {
    const request = new CRequest('GET', 'https://localhost', '', {});
    const webClient = new HttpsWebClient(undefined, undefined, 1);
    await expect(() => webClient.call(request)).rejects.toThrowError('Request time out');
    await expect(() => webClient.call(request)).rejects.toBeInstanceOf(WebClientException);
  });

  test('call keeps existing timeout behavior', async () => {
    const request = new CRequest('GET', 'https://localhost', '', {}, 1);
    const webClient = new HttpsWebClient(undefined, undefined);
    await expect(() => webClient.call(request)).rejects.toBeInstanceOf(Error);
    await expect(() => webClient.call(request)).rejects.not.toBeInstanceOf(WebClientException);
  });

  test('fire request', () => {
    const captured: CRequest[] = [];
    const observer = (requestCaptured: CRequest): void => {
      captured.push(requestCaptured);
    };

    const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
    const webClient = new HttpsWebClient(observer);
    webClient.fireRequest(request);
    expect(captured[0]).toBe(request);
  });

  test('fire response', () => {
    const captured: CResponse[] = [];
    const observer = (capturedResponse: CResponse): void => {
      captured.push(capturedResponse);
    };

    const response = new CResponse(200, '', {});
    const webClient = new HttpsWebClient(undefined, observer);
    webClient.fireResponse(response);
    expect(captured[0]).toBe(response);
  });
});

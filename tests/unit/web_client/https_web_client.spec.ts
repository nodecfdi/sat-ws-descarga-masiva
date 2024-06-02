import { CRequest } from '#src/web_client/crequest';
import { CResponse } from '#src/web_client/cresponse';
import { HttpsWebClient } from '#src/web_client/https_web_client';

describe('https web client test', () => {
  test('call throws web exception', async () => {
    const request = new CRequest('GET', 'unknown://invalid uri/', '', {});
    const webClient = new HttpsWebClient();
    await expect(() => webClient.call(request)).rejects.toThrowError('Invalid URL');
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

import { CRequest } from '#src/web_client/crequest';
import { CResponse } from '#src/web_client/cresponse';
import { HttpClientError } from '#src/web_client/exceptions/http_client_error';
import { WebClientException } from '#src/web_client/exceptions/web_client_exception';

describe('http client error', () => {
  test('instance of webclientexception', () => {
    const exception = new HttpClientError(
      'message',
      new CRequest('GET', 'unknown://invalid uri/', '', {}),
      new CResponse(200, '', {}),
    );

    expect(exception).toBeInstanceOf(WebClientException);
  });
});

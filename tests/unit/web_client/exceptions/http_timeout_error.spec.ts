import { CRequest } from '#src/web_client/crequest';
import { CResponse } from '#src/web_client/cresponse';
import { HttpTimeoutError } from '#src/web_client/exceptions/http_timeout_error';
import { WebClientException } from '#src/web_client/exceptions/web_client_exception';

describe('http timeout error', () => {
  test('instance of webclientexception', () => {
    const exception = new HttpTimeoutError(
      'message',
      new CRequest('GET', 'unknown://invalid uri/', '', {}),
      CResponse.timeout(),
    );

    expect(exception).toBeInstanceOf(WebClientException);
  });
});

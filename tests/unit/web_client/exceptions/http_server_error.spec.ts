import { CRequest } from '#src/web_client/crequest';
import { CResponse } from '#src/web_client/cresponse';
import { HttpServerError } from '#src/web_client/exceptions/http_server_error';
import { WebClientException } from '#src/web_client/exceptions/web_client_exception';

describe('http server error', () => {
  test('instance of webclientexception', () => {
    const exception = new HttpServerError(
      'message',
      new CRequest('GET', 'unknown://invalid uri/', '', {}),
      new CResponse(200, '', {}),
    );

    expect(exception).toBeInstanceOf(WebClientException);
  });
});

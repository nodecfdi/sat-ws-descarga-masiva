import { CRequest } from '~/web-client/crequest';
import { CResponse } from '~/web-client/cresponse';
import { HttpServerError } from '~/web-client/exceptions/http-server-error';
import { WebClientException } from '~/web-client/exceptions/web-client-exception';
describe('http server error', () => {
    test('instance of webclientexception', () => {
        const exception = new HttpServerError(
            'message',
            new CRequest('GET', 'unknown://invalid uri/', '', {}),
            new CResponse(200, '', {})
        );

        expect(exception).toBeInstanceOf(WebClientException);
    });
});

import { CRequest } from '../../../../src/web-client/crequest';
import { CResponse } from '../../../../src/web-client/cresponse';
import { HttpServerError } from '../../../../src/web-client/exceptions/http-server-error';
import { WebClientException } from '../../../../src/web-client/exceptions/web-client-exception';
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

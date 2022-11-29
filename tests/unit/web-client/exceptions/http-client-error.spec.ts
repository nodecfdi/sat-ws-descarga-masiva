import { CRequest } from '~/web-client/crequest';
import { CResponse } from '~/web-client/cresponse';
import { HttpClientError } from '~/web-client/exceptions/http-client-error';
import { WebClientException } from '~/web-client/exceptions/web-client-exception';
describe('http client error', () => {
    test('instance of webclientexception', () => {
        const exception = new HttpClientError(
            'message',
            new CRequest('GET', 'unknown://invalid uri/', '', {}),
            new CResponse(200, '', {})
        );

        expect(exception).toBeInstanceOf(WebClientException);
    });
});

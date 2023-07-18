import { CRequest } from 'src/web-client/crequest';
import { CResponse } from 'src/web-client/cresponse';
import { HttpClientError } from 'src/web-client/exceptions/http-client-error';
import { WebClientException } from 'src/web-client/exceptions/web-client-exception';

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

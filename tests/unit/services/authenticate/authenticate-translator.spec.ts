import { TestCase } from '../../../test-case';
import { Helpers } from '../../../../src/internal/helpers';
import { AuthenticateTranslator } from '../../../../src/services/authenticate/authenticate-translator';
import { DateTime } from '../../../../src/shared/date-time';
describe('Authenticate translator', () => {
    test('create soap request', () => {
        const translator = new AuthenticateTranslator();
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();

        const since = DateTime.create('2019-07-31 22:38:19', 'America/Mexico_City');
        const until = DateTime.create('2019-07-31 22:43:19', 'America/Mexico_City');
        const securityTokenId = 'uuid-cf6c80fb-00ae-44c0-af56-54ec65decbaa-1';
        const requestBody = translator.createSoapRequestWithData(requestBuilder, since, until, securityTokenId);

        expect(TestCase.xmlFormat(requestBody)).toBe(Helpers.nospaces(TestCase.fileContents('authenticate/request.xml')));
    });

    test('create token from soap response with token', () => {
        const expectedCreated = DateTime.create('2019-08-01T03:38:20.044Z');
        const expectedExpires = DateTime.create('2019-08-01T03:43:20.044Z');

        const translator = new AuthenticateTranslator();
        const responseBody = Helpers.nospaces(TestCase.fileContents('authenticate/response-with-token.xml'));
        const token = translator.createTokenFromSoapResponse(responseBody);

        expect(token.isValueEmpty()).toBeFalsy();
        expect(token.isExpired()).toBeTruthy();
        expect(token.getCreated().equalsTo(expectedCreated)).toBeTruthy();
        expect(token.getExpires().equalsTo(expectedExpires)).toBeTruthy();
        expect(token.isValid()).toBeFalsy();
    });

    test('create token from soap response with error', () => {
        const translator = new AuthenticateTranslator();
        const responseBody = Helpers.nospaces(TestCase.fileContents('authenticate/response-with-error.xml'));

        const token = translator.createTokenFromSoapResponse(responseBody);

        expect(token.isValueEmpty()).toBeTruthy();
        expect(token.isExpired()).toBeTruthy();
        expect(token.isValid()).toBeFalsy();
        expect(token.getValue()).toBe('');
    });
});

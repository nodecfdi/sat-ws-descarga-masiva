import { TestCase } from '../../test-case';
import { CResponse } from '~/web-client/cresponse';
import { WebClientInterface } from '~/web-client/web-client-interface';
import { ServiceConsumer } from '~/internal/service-consumer';
import { mock, MockProxy } from 'jest-mock-extended';
import { Token } from '~/shared/token';
import { DateTime } from '~/index';
import { CRequest } from '~/web-client/crequest';
import { WebClientException } from '~/web-client/exceptions/web-client-exception';
import { SoapFaultError } from '~/web-client/exceptions/soap-fault-error';
import { HttpServerError } from '~/web-client/exceptions/http-server-error';

describe('service consumer test', () => {
    let webClient: MockProxy<WebClientInterface>;

    test('execute', async () => {
        const responseBody = TestCase.fileContents('authenticate/response-with-token.xml');
        const response = new CResponse(200, responseBody);

        webClient = mock<WebClientInterface>();
        webClient.call.mockResolvedValueOnce(response);

        const consumer = new ServiceConsumer();
        const token = new Token(
            new DateTime('2020-01-13 14:15:16'),
            new DateTime('2020-01-13 14:15:16'),
            'token-value'
        );
        const returnValue = await consumer.execute(webClient, 'soap-action', 'uri', 'body', token);

        expect(returnValue).toBe(responseBody);
    });

    test('create request', () => {
        const consumer = new ServiceConsumer();
        const request = consumer.createRequest('uri', 'body', { 'x-foo': 'foo value' });
        const expected = new CRequest('POST', 'uri', 'body', { 'x-foo': 'foo value' });
        expect(request).toStrictEqual(expected);
    });

    test('create headers with token', () => {
        const consumer = new ServiceConsumer();
        const soapAction = 'soap-action';
        const tokenValue = 'token-value';
        const token = new Token(new DateTime('2020-01-13 14:15:16'), new DateTime('2020-01-13 14:15:16'), tokenValue);
        const headers = consumer.createHeaders(soapAction, token);
        const expected = {
            SOAPAction: soapAction,
            Authorization: `WRAP access_token="${tokenValue}"`
        };
        expect(headers).toStrictEqual(expected);
    });

    test('create headers without token', () => {
        const consumer = new ServiceConsumer();
        const soapAction = 'soap-action';
        const headers = consumer.createHeaders(soapAction);
        const expected = { SOAPAction: soapAction };
        expect(headers).toStrictEqual(expected);
    });

    test('run request', async () => {
        const request = new CRequest('POST', 'uri', 'request', { 'x-foo': 'foo value' });
        const response = new CResponse(200, 'response');

        webClient = mock<WebClientInterface>();

        webClient.fireRequest.calledWith(request);
        webClient.call.calledWith(request).mockResolvedValueOnce(response);
        webClient.fireResponse.calledWith(response);

        const consumer = new ServiceConsumer();
        const returned = await consumer.runRequest(webClient, request);

        expect(response).toStrictEqual(returned);
    });

    test('run request with web client exception', async () => {
        const request = new CRequest('POST', 'uri', 'request', { 'x-foo': 'foo value' });
        const response = new CResponse(500, '');
        const exception = new WebClientException('foo', request, response);

        webClient = mock<WebClientInterface>();

        webClient.fireRequest.calledWith(request);
        webClient.call.mockRejectedValueOnce(exception);
        webClient.fireResponse.calledWith(response);

        const consumer = new ServiceConsumer();
        try {
            await consumer.runRequest(webClient, request);
        } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect((error as WebClientException).getResponse()).toStrictEqual(response);
        }
    });

    test('check error with fault', () => {
        const request = new CRequest('POST', 'uri', 'body', {});
        const responseBody = TestCase.fileContents('authenticate/response-with-error.xml');
        const response = new CResponse(200, responseBody);
        const consumer = new ServiceConsumer();

        expect(() => consumer.checkErrors(request, response)).toThrow(SoapFaultError);
    });

    test('check error on server side', () => {
        const request = new CRequest('POST', 'uri', 'body', {});
        const response = new CResponse(500, '<xml/>');
        const consumer = new ServiceConsumer();

        const result = (): void => consumer.checkErrors(request, response);
        expect(result).toThrow(HttpServerError);
        expect(result).toThrow('Unexpected server error status code');
    });

    test('check error on empty response', () => {
        const request = new CRequest('POST', 'uri', 'body', {});
        const response = new CResponse(200, '');
        const consumer = new ServiceConsumer();

        const result = (): void => consumer.checkErrors(request, response);
        expect(result).toThrow(HttpServerError);
        expect(result).toThrow('Unexpected empty response from server');
    });
});

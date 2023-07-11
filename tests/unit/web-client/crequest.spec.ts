import { useTestCase } from '../../test-case';
import { CRequest } from 'src/web-client/crequest';

describe('crequest', () => {
    const { fileContents } = useTestCase();
    test('properties', () => {
        const method = 'POST';
        const uri = 'http://localhost';
        const body = 'this is the body';
        const customHeaders = { 'X-Header': 'content' };

        const request = new CRequest(method, uri, body, customHeaders);
        const map = new Map([...Object.entries(customHeaders), ...Object.entries(request.defaultHeaders())]);
        const headers = Object.fromEntries(map);

        expect(request.getMethod()).toBe(method);
        expect(request.getUri()).toBe(uri);
        expect(request.getBody()).toBe(body);
        expect(request.getHeaders()).toStrictEqual(headers);
    });

    test('json', () => {
        const method = 'POST';
        const uri = 'http://localhost';
        const body = 'this is the body';
        const customHeaders = { 'X-Header': 'content' };

        const request = new CRequest(method, uri, body, customHeaders);

        const expectedFile = fileContents('json/webclient-request.json');

        expect(JSON.stringify(request)).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

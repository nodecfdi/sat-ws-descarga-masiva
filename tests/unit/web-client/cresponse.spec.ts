import { useTestCase } from '../../test-case.js';
import { CResponse } from '#src/web-client/cresponse';

describe('cresponse', () => {
  const { fileContents } = useTestCase();
  test('properties', () => {
    const statusCode = 200;
    const body = 'this is the body';
    const headers = { 'X-Header': 'content' };

    const response = new CResponse(statusCode, body, headers);

    expect(response.getStatusCode()).toBe(statusCode);
    expect(response.getBody()).toBe(body);
    expect(response.getHeaders()).toBe(headers);
    expect(response.isEmpty()).toBeFalsy();
  });

  test('response with empty content', () => {
    const response = new CResponse(200, '', {});

    expect(response.getBody()).toBe('');
    expect(response.isEmpty()).toBeTruthy();
  });

  test.each([
    [200, false],
    [399, false],
    [400, true],
    [499, true],
    [500, false],
  ])('status code is client error', (code: number, expected: boolean) => {
    const response = new CResponse(code, '', {});

    expect(response.statusCodeIsClientError()).toBe(expected);
  });

  test.each([
    [200, false],
    [399, false],
    [400, false],
    [499, false],
    [500, true],
    [599, true],
    [600, false],
  ])('status code is server error', (code: number, expected: boolean) => {
    const response = new CResponse(code, '', {});

    expect(response.statusCodeIsServerError()).toBe(expected);
  });

  test('json', () => {
    const statusCode = 200;
    const body = 'this is the body';
    const headers = {
      'X-First': 'first header',
      'X-Second': 'second header',
    };

    const response = new CResponse(statusCode, body, headers);

    const expectedFile = fileContents('json/webclient-response.json');

    expect(JSON.stringify(response)).toBe(JSON.stringify(JSON.parse(expectedFile)));
  });
});

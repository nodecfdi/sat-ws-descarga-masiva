import { StatusCode } from '../../../../src/shared/status-code';
import { QueryResult } from '../../../../src/services/query/query-result';
import { TestCase } from '../../../test-case';
describe('query result', () => {
    test('properties', () => {
        const statusCode = new StatusCode(9, 'foo');
        const requestId = 'x-request-id';

        const result = new QueryResult(statusCode, requestId);

        expect(result.getStatus()).toBe(statusCode);
        expect(result.getRequestId()).toBe(requestId);
    });

    test('empty request id', () => {
        const requestId = '';

        const result = new QueryResult(new StatusCode(9, 'foo'), requestId);

        expect(result.getRequestId()).toBe(requestId);
    });

    test('json', () => {
        const statusCode = new StatusCode(9, 'foo');
        const requestId = 'x-request-id';

        const result = new QueryResult(statusCode, requestId);

        const expectedFile = TestCase.fileContents('json/query-result.json');

        expect(JSON.stringify(result.jsonSerialize())).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

import { TestCase } from '../../../test-case';
import { Helpers } from '../../../../src/internal/helpers';
import { QueryTranslator } from '../../../../src/services/query/query-translator';
import { QueryParameters } from '../../../../src/services/query/query-parameters';
import { DateTimePeriod } from '../../../../src/shared/date-time-period';
import { DateTime } from '../../../../src/shared/date-time';
import { DownloadType } from '../../../../src/shared/download-type';
import { RequestType } from '../../../../src/shared/request-type';
describe('query translator', () => {
    test('create query result from soap response', () => {
        const expectedRequestId = 'd49af78d-1c80-4221-a48d-345ace91626b';
        const expectedStatusCode = 5000;
        const expectedMessage = 'Solicitud Aceptada';

        const translator = new QueryTranslator();
        const responseBody = Helpers.nospaces(TestCase.fileContents('query/response-with-id.xml'));

        const result = translator.createQueryResultFromSoapResponse(responseBody);

        const status = result.getStatus();

        expect(result.getRequestId()).toBe(expectedRequestId);
        expect(status.getCode()).toBe(expectedStatusCode);
        expect(status.getMessage()).toBe(expectedMessage);
        expect(status.isAccepted()).toBeTruthy();
    });

    test('create soap request', () => {
        const translator = new QueryTranslator();
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const since = DateTime.create('2019-01-01 00:00:00');
        const until = DateTime.create('2019-01-01 00:04:00');
        const query = QueryParameters.create(
            DateTimePeriod.create(since, until),
            DownloadType.received,
            RequestType.cfdi,
        );
        const requestBody = translator.createSoapRequest(requestBuilder, query);
        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(Helpers.nospaces(TestCase.fileContents('query/request-received.xml')));
    });
});

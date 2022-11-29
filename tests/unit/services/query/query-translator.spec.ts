import { TestCase } from '../../../test-case';
import { Helpers } from '~/internal/helpers';
import { QueryTranslator } from '~/services/query/query-translator';
import { QueryParameters } from '~/services/query/query-parameters';
import { DateTimePeriod } from '~/shared/date-time-period';
import { ServiceType } from '~/shared/service-type';
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
        const query = QueryParameters.create()
            .withPeriod(DateTimePeriod.createFromValues('2019-01-01 00:00:00', '2019-01-01 00:04:00'))
            .withServiceType(new ServiceType('cfdi'));

        const requestBody = translator.createSoapRequest(requestBuilder, query);
        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('query/request-issued.xml'))
        );
    });
});

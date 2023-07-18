import { useTestCase } from '../../../test-case';
import { Helpers } from 'src/internal/helpers';
import { QueryTranslator } from 'src/services/query/query-translator';
import { QueryParameters } from 'src/services/query/query-parameters';
import { DateTimePeriod } from 'src/shared/date-time-period';
import { ServiceType } from 'src/shared/service-type';

describe('query translator', () => {
    const { fileContents, createFielRequestBuilderUsingTestingFiles, xmlFormat } = useTestCase();
    test('create query result from soap response', () => {
        const expectedRequestId = 'd49af78d-1c80-4221-a48d-345ace91626b';
        const expectedStatusCode = 5000;
        const expectedMessage = 'Solicitud Aceptada';

        const translator = new QueryTranslator();
        const responseBody = Helpers.nospaces(fileContents('query/response-with-id.xml'));

        const result = translator.createQueryResultFromSoapResponse(responseBody);

        const status = result.getStatus();

        expect(result.getRequestId()).toBe(expectedRequestId);
        expect(status.getCode()).toBe(expectedStatusCode);
        expect(status.getMessage()).toBe(expectedMessage);
        expect(status.isAccepted()).toBeTruthy();
    });

    test('create soap request', () => {
        const translator = new QueryTranslator();
        const requestBuilder = createFielRequestBuilderUsingTestingFiles();
        const query = QueryParameters.create()
            .withPeriod(DateTimePeriod.createFromValues('2019-01-01 00:00:00', '2019-01-01 00:04:00'))
            .withServiceType(new ServiceType('cfdi'));

        const requestBody = translator.createSoapRequest(requestBuilder, query);
        expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
            Helpers.nospaces(fileContents('query/request-issued.xml')),
        );
    });
});

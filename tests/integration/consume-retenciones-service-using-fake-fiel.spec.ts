import { TestCase } from '../test-case';
import { RequestBuilderInterface } from '../../src/request-builder/request-builder-interface';
import { Service } from '../../src/service';
import { AxiosWebClient } from '../../src/web-client/axios-web-client';
import { DateTimePeriod } from '../../src/shared/date-time-period';
import { DateTime } from '../../src/shared/date-time';
import { QueryParameters } from '../../src/services/query/query-parameters';
import { DownloadType } from '../../src/shared/download-type';
import { RequestType } from '../../src/shared/request-type';
import { ServiceEndpoints } from '../../src/shared/service-endpoints';

describe('consume cfdi service using fake fiel', () => {
    let requestBuilder: RequestBuilderInterface;
    let webClient: AxiosWebClient;
    let service: Service;

    beforeEach(() => {
        requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        webClient = new AxiosWebClient();
        service = new Service(requestBuilder, webClient, undefined, ServiceEndpoints.retenciones());
    });

    test('authentication', async () => {
        const token = await service.authenticate();
        expect(token.isValid()).toBeTruthy();
    });

    test('query issued', async () => {
        const since = DateTime.create('2019-01-01 00:00:00');
        const until = DateTime.create('2019-01-01 00:04:00');
        const dateTimePeriod = DateTimePeriod.create(since, until);
        const parameters = QueryParameters.create(dateTimePeriod, DownloadType.issued, RequestType.cfdi);

        const result = await service.query(parameters);

        expect(result.getStatus().getCode()).toBe(305);
    });

    test('query received', async () => {
        const since = DateTime.create('2019-01-01 00:00:00');
        const until = DateTime.create('2019-01-01 00:04:00');
        const dateTimePeriod = DateTimePeriod.create(since, until);
        const parameters = QueryParameters.create(dateTimePeriod, DownloadType.received, RequestType.cfdi);

        const result = await service.query(parameters);

        expect(result.getStatus().getCode()).toBe(305);
    });

    test('verify', async () => {
        const requestId = '3edbd462-9fa0-4363-b60f-bac332338028';

        const result = await service.verify(requestId);

        expect(result.getStatus().getCode()).toBe(305);
    });

    test('download', async () => {
        const requestId = '4e80345d-917f-40bb-a98f-4a73939343c5_01';

        const result = await service.download(requestId);

        expect(result.getStatus().getCode()).toBe(305);
    });
});

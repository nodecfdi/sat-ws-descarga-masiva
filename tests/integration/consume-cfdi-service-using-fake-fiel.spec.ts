import { TestCase } from '../test-case';
import { RequestBuilderInterface } from '../../src/request-builder/request-builder-interface';
import { Service } from '../../src/service';
import { AxiosWebClient } from '../../src/web-client/axios-web-client';
import { DateTimePeriod } from '../../src/shared/date-time-period';
import { DateTime } from '../../src/shared/date-time';
import { QueryParameters } from '../../src/services/query/query-parameters';
import { DownloadType } from '../../src/shared/download-type';
import { RequestType } from '../../src/shared/request-type';

describe('consume cfdi service using fake fiel', () => {

    let requestBuilder: RequestBuilderInterface;
    let webClient: AxiosWebClient;
    let service: Service;

    beforeEach(() => {
        requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        webClient = new AxiosWebClient();
        service = new Service(requestBuilder, webClient);
    });

    test('authentication', async () => {
        const token = await service.authenticate();
        expect(token.isValid()).toBeTruthy();
    });
    test('query ', async () => {
        const since = DateTime.create('2019-01-01 00:00:00');
        const until = DateTime.create('2019-01-01 00:04:00');
        const dateTimePeriod = DateTimePeriod.create(since, until);
        const parameters = QueryParameters.create(dateTimePeriod, DownloadType.received, RequestType.cfdi);

        const result = await service.query(parameters);

        expect(result.getStatus().getCode()).toBe(305);
    });
});

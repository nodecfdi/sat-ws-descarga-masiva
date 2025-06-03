import { DateTime as LDateTime } from 'luxon';
import { type RequestBuilderInterface } from '#src/request_builder/request_builder_interface';
import { Service } from '#src/service';
import { QueryParameters } from '#src/services/query/query_parameters';
import { ComplementoRetenciones } from '#src/shared/complemento_retenciones';
import { DateTime } from '#src/shared/date_time';
import { DateTimePeriod } from '#src/shared/date_time_period';
import { DocumentStatus } from '#src/shared/document_status';
import { DownloadType } from '#src/shared/download_type';
import { RequestType } from '#src/shared/request_type';
import { RfcMatch } from '#src/shared/rfc_match';
import { RfcOnBehalf } from '#src/shared/rfc_on_behalf';
import { ServiceEndpoints } from '#src/shared/service_endpoints';
import { Uuid } from '#src/shared/uuid';
import { HttpsWebClient } from '#src/web_client/https_web_client';
import { createFielRequestBuilderUsingTestingFiles } from '#tests/test_utils';

describe('consume retenciones service using fake fiel', () => {
  let requestBuilder: RequestBuilderInterface;
  let webClient: HttpsWebClient;
  let service: Service;

  const getServiceEndpoints = (): ServiceEndpoints => {
    return ServiceEndpoints.retenciones();
  };

  beforeEach(() => {
    requestBuilder = createFielRequestBuilderUsingTestingFiles();
    webClient = new HttpsWebClient();
    service = new Service(requestBuilder, webClient, undefined, getServiceEndpoints());
  });

  test('authentication', async () => {
    const token = await service.authenticate();
    expect(token.isValid()).toBeTruthy();
  }, 50_000);

  test('query default parameters', async () => {
    const parameters = QueryParameters.create();

    const result = await service.query(parameters);
    expect(result.getStatus().getCode()).toBe(305);
  }, 50_000);

  test('query change filters', async () => {
    const startDate = DateTime.create(
      LDateTime.now().minus({month: 1}).startOf('month').toUnixInteger(),
    );
    const endDate = startDate.modify({days: 5});
    const period = DateTimePeriod.create(startDate, endDate);
    const parameters = QueryParameters.create()
      .withPeriod(period)
      .withDownloadType(new DownloadType('received'))
      .withRequestType(new RequestType('xml'))
      .withComplement(new ComplementoRetenciones('undefined'))
      .withDocumentStatus(new DocumentStatus('active'))
      .withRfcOnBehalf(RfcOnBehalf.create('XXX01010199A'))
      .withRfcMatch(RfcMatch.create('AAA010101AAA'));

    const result = await service.query(parameters);

    expect(result.getStatus().getCode()).toBe(305);
  }, 50_000);

  test('query uuid', async () => {
    const parameters = QueryParameters.create().withUuid(
      Uuid.create('96623061-61fe-49de-b298-c7156476aa8b'),
    );

    const result = await service.query(parameters);
    expect(result.getStatus().getCode()).toBe(305);
  }, 50_000);

  test('verify', async () => {
    const requestId = '3edbd462-9fa0-4363-b60f-bac332338028';

    const result = await service.verify(requestId);

    expect(result.getStatus().getCode()).toBe(305);
  }, 50_000);

  test('download', async () => {
    const requestId = '4e80345d-917f-40bb-a98f-4a73939343c5_01';

    const result = await service.download(requestId);

    expect(result.getStatus().getCode()).toBe(305);
  }, 50_000);
});

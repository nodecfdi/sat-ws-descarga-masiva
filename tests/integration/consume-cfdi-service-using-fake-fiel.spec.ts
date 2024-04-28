import { type RequestBuilderInterface } from '#src/request-builder/request-builder-interface';
import { Service } from '#src/service';
import { QueryParameters } from '#src/services/query/query-parameters';
import { type QueryResult } from '#src/services/query/query-result';
import { ComplementoCfdi } from '#src/shared/complemento-cfdi';
import { DateTimePeriod } from '#src/shared/date-time-period';
import { DocumentStatus } from '#src/shared/document-status';
import { DocumentType } from '#src/shared/document-type';
import { DownloadType} from '#src/shared/download-type';
import { RequestType } from '#src/shared/request-type';
import { RfcMatch } from '#src/shared/rfc-match';
import { RfcOnBehalf } from '#src/shared/rfc-on-behalf';
import { ServiceEndpoints } from '#src/shared/service-endpoints';
import { ServiceType } from '#src/shared/service-type';
import { Uuid } from '#src/shared/uuid';
import { HttpsWebClient } from '#src/web-client/https-web-client';
import { useTestCase } from '../test-case.js';

describe('consume cfdi service using fake fiel', () => {
  let requestBuilder: RequestBuilderInterface;
  let webClient: HttpsWebClient;
  let service: Service;

  const { createFielRequestBuilderUsingTestingFiles } = useTestCase();

  function getServiceEndpoints(): ServiceEndpoints {
    return ServiceEndpoints.cfdi();
  }

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

  test('query change all parameteres', async () => {
    const parameters = QueryParameters.create()
      .withPeriod(DateTimePeriod.createFromValues('2019-01-01 00:00:00', '2019-01-01 00:04:00'))
      .withDownloadType(new DownloadType('received'))
      .withRequestType(new RequestType('xml'))
      .withDocumentType(new DocumentType('nomina'))
      .withComplement(new ComplementoCfdi('nomina12'))
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

  test('service endpoints different than query endpoints throws error', async () => {
    const otherServiceType = new ServiceType('retenciones');
    const parameters = QueryParameters.create().withServiceType(otherServiceType);
    const result = async (): Promise<QueryResult> => service.query(parameters);
    await expect(result).rejects.toThrow(Error);
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

import { QueryParameters } from '#src/services/query/query_parameters';
import { ComplementoCfdi } from '#src/shared/complemento_cfdi';
import { DateTime } from '#src/shared/date_time';
import { DateTimePeriod } from '#src/shared/date_time_period';
import { DocumentStatus } from '#src/shared/document_status';
import { DocumentType } from '#src/shared/document_type';
import { DownloadType } from '#src/shared/download_type';
import { RequestType } from '#src/shared/request_type';
import { RfcMatch } from '#src/shared/rfc_match';
import { RfcMatches } from '#src/shared/rfc_matches';
import { RfcOnBehalf } from '#src/shared/rfc_on_behalf';
import { Uuid } from '#src/shared/uuid';
import { useTestCase } from '../../../test_case.js';

describe('query parameters', () => {
  const { fileContents } = useTestCase();
  test('all properties', () => {
    const period = DateTimePeriod.create(
      DateTime.create('2019-01-01 00:00:00'),
      DateTime.create('2019-01-01 00:04:00'),
    );
    const downloadType = new DownloadType('received');
    const requestType = new RequestType('xml');
    const documentType = new DocumentType('ingreso');
    const documentStatus = new DocumentStatus('active');
    const uuid = Uuid.create('96623061-61fe-49de-b298-c7156476aa8b');
    const rfcOnBehalf = RfcOnBehalf.create('XXX01010199A');
    const rfcMatches = RfcMatches.createFromValues('ABA991231XX0');
    const complement = new ComplementoCfdi('leyendasFiscales10');

    let query = QueryParameters.create()
      .withPeriod(period)
      .withDownloadType(downloadType)
      .withRequestType(requestType)
      .withDocumentType(documentType)
      .withComplement(complement)
      .withDocumentStatus(documentStatus)
      .withUuid(uuid)
      .withRfcOnBehalf(rfcOnBehalf)
      .withRfcMatches(rfcMatches);

    expect(query.getPeriod()).toBe(period);
    expect(query.getDownloadType()).toBe(downloadType);
    expect(query.getRequestType()).toBe(requestType);
    expect(query.getDocumentType()).toBe(documentType);
    expect(query.getComplement()).toBe(complement);
    expect(query.getDocumentStatus()).toBe(documentStatus);
    expect(query.getUuid()).toBe(uuid);
    expect(query.getRfcOnBehalf()).toBe(rfcOnBehalf);
    expect(query.getRfcMatches()).toBe(rfcMatches);

    const rfcMatch = RfcMatch.create('AAAA010101AAA');
    query = query.withRfcMatch(rfcMatch);
    expect(query.getRfcMatch()).toBe(rfcMatch);
    expect(query.getRfcMatches().getFirst()).toBe(rfcMatch);
  });

  test('minimal create', () => {
    const period = DateTimePeriod.create(
      DateTime.create('2019-01-01 00:00:00'),
      DateTime.create('2019-01-01 00:04:00'),
    );

    const query = QueryParameters.create(period);

    expect(query.getPeriod()).toBe(period);
    expect(query.getRequestType().isTypeOf('metadata')).toBeTruthy();
    expect(query.getDownloadType().isTypeOf('issued')).toBeTruthy();
    expect(query.getDocumentType().isTypeOf('undefined')).toBeTruthy();
    expect(query.getComplement().isTypeOf('undefined')).toBeTruthy();
    expect(query.getDocumentStatus().isTypeOf('undefined')).toBeTruthy();
    expect(query.getUuid().isEmpty()).toBeTruthy();
    expect(query.getRfcOnBehalf().isEmpty()).toBeTruthy();
    expect(query.getRfcMatch().isEmpty()).toBeTruthy();
  });

  test('json', () => {
    const query = QueryParameters.create()
      .withPeriod(
        DateTimePeriod.createFromValues('2019-01-01T00:00:00-06:00', '2019-01-01T00:04:00-06:00'),
      )
      .withDownloadType(new DownloadType('received'))
      .withRequestType(new RequestType('xml'))
      .withDocumentType(new DocumentType('ingreso'))
      .withComplement(new ComplementoCfdi('leyendasFiscales10'))
      .withDocumentStatus(new DocumentStatus('cancelled'))
      .withUuid(Uuid.create('96623061-61fe-49de-b298-c7156476aa8b'))
      .withRfcOnBehalf(RfcOnBehalf.create('XXX01010199A'))
      .withRfcMatch(RfcMatch.create('AAAA010101AAA'));

    const expectedFile = fileContents('json/query-parameters.json');

    expect(JSON.stringify(query)).toBe(JSON.stringify(JSON.parse(expectedFile)));
  });
});

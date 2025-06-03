import { DateTime as LDateTime } from 'luxon';
import { QueryParameters } from '#src/services/query/query_parameters';
import { ComplementoCfdi } from '#src/shared/complemento_cfdi';
import { ComplementoRetenciones } from '#src/shared/complemento_retenciones';
import { DateTime } from '#src/shared/date_time';
import { DateTimePeriod } from '#src/shared/date_time_period';
import { DocumentStatus } from '#src/shared/document_status';
import { DocumentType } from '#src/shared/document_type';
import { DownloadType } from '#src/shared/download_type';
import { RequestType } from '#src/shared/request_type';
import { RfcMatch } from '#src/shared/rfc_match';
import { RfcMatches } from '#src/shared/rfc_matches';
import { ServiceType } from '#src/shared/service_type';
import { Uuid } from '#src/shared/uuid';

describe('query validator', () => {
  test('query invalid period', () => {
    const date = DateTime.create('2025-01-02 03:04:05');
    const query = QueryParameters.create(DateTimePeriod.create(date, date));

    expect(query.validate()[0]).toBe(
      'La fecha de inicio (2025-01-02 03:04:05) no puede ser mayor o igual a la fecha final (2025-01-02 03:04:05) del periodo de consulta.',
    );
  });

  test('query period start date exceeds lower bound', () => {
    const now = LDateTime.now();
    const lowerBound = now.minus({ years: 6 }).startOf('day');
    const start = lowerBound.minus({ second: 1 });
    const startToSend = new DateTime(start.toISO());
    const nowToSend = new DateTime(lowerBound.toISO());
    const query = QueryParameters.create(DateTimePeriod.create(startToSend, nowToSend));
    const format = 'yyyy-MM-dd HH:mm:ss';

    expect(query.validate()[0]).toBe(
      `La fecha de inicio (${query.getPeriod().getStart().format(format)}) no puede ser menor a hoy menos 6 años atrás (${lowerBound.toFormat(format)}).`,
    );
  });

  test('query received xml cancelled', () => {
    const query = QueryParameters.create()
      .withDownloadType(new DownloadType('received'))
      .withRequestType(new RequestType('xml'))
      .withDocumentStatus(new DocumentStatus('cancelled'));

    expect(query.validate()[0]).toBe(
      'No es posible hacer una consulta de XML Recibidos que contenga Cancelados. Solicitado: Cancelado.',
    );
  });

  test('query received xml undefined', () => {
    const query = QueryParameters.create()
      .withDownloadType(new DownloadType('received'))
      .withRequestType(new RequestType('xml'))
      .withDocumentStatus(new DocumentStatus('undefined'));

    expect(query.validate()[0]).toBe(
      'No es posible hacer una consulta de XML Recibidos que contenga Cancelados. Solicitado: Todos.',
    );
  });

  test('query received with more than one counterparty', () => {
    const query = QueryParameters.create()
      .withDownloadType(new DownloadType('received'))
      .withRfcMatches(RfcMatches.createFromValues('AAA010101AAA', 'BBB010101AAA'));

    expect(query.validate()[0]).toBe(
      'No es posible hacer una consulta de Recibidos con más de 1 RFC emisor.',
    );
  });

  test('query received with more than five counterparties', () => {
    const rfcMatches = RfcMatches.createFromValues(
      'AAA010101AAA',
      'BBB010101AAA',
      'CCC010101AAA',
      'DDD010101AAA',
      'EEE010101AAA',
      'FFF010101AAA',
    );
    const query = QueryParameters.create()
      .withDownloadType(new DownloadType('issued'))
      .withRfcMatches(rfcMatches);

    expect(query.validate()[0]).toBe(
      'No es posible hacer una consulta de Recibidos con más de 5 RFC receptores.',
    );
  });

  test('query cfdi invalid complement', () => {
    const wrongComplement = ComplementoRetenciones.create('intereses');
    const query = QueryParameters.create()
      .withServiceType(new ServiceType('cfdi'))
      .withComplement(wrongComplement);

    expect(query.validate()[0]).toBe(
      `El complemento de CFDI definido no es un complemento registrado de este tipo ${wrongComplement.label()}.`,
    );
  });

  test('query retencion invalid complement', () => {
    const wrongComplement = ComplementoCfdi.create('comercioExterior11');
    const query = QueryParameters.create()
      .withServiceType(new ServiceType('retenciones'))
      .withComplement(wrongComplement);

    expect(query.validate()[0]).toBe(
      `El complemento de Retenciones definido no es un complemento registrado de este tipo ${wrongComplement.label()}.`,
    );
  });

  test('query uuid with counterpart', () => {
    const query = QueryParameters.create()
      .withUuid(new Uuid('96623061-61fe-49de-b298-c7156476aa8b'))
      .withRfcMatch(RfcMatch.create('AAA010101AAA'));
    expect(query.validate()[0]).toBe('En una consulta por UUID no se debe usar el filtro de RFC.');
  });

  test('query uuid with complement', () => {
    const query = QueryParameters.create()
      .withUuid(new Uuid('96623061-61fe-49de-b298-c7156476aa8b'))
      .withComplement(ComplementoCfdi.create('comercioExterior11'));
    expect(query.validate()[0]).toBe(
      'En una consulta por UUID no se debe usar el filtro de complemento.',
    );
  });

  test('query uuid with document status', () => {
    const query = QueryParameters.create()
      .withUuid(new Uuid('96623061-61fe-49de-b298-c7156476aa8b'))
      .withDocumentStatus(new DocumentStatus('active'));
    expect(query.validate()[0]).toBe(
      'En una consulta por UUID no se debe usar el filtro de estado de documento.',
    );
  });

  test('query uuid with document type', () => {
    const query = QueryParameters.create()
      .withUuid(new Uuid('96623061-61fe-49de-b298-c7156476aa8b'))
      .withDocumentType(new DocumentType('nomina'));
    expect(query.validate()[0]).toBe(
      'En una consulta por UUID no se debe usar el filtro de tipo de documento.',
    );
  });
});

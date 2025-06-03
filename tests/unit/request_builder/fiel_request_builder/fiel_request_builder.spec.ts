import { type Document, getParser } from '@nodecfdi/cfdi-core';
import { type SerialNumber } from '@nodecfdi/credentials';
import { type Certificate, Credential, type PrivateKey } from '@nodecfdi/credentials/node';
import { mock } from 'vitest-mock-extended';
import { useNamespaces } from 'xpath';
import { Helpers } from '#src/internal/helpers';
import { Fiel } from '#src/request_builder/fiel_request_builder/fiel';
import { FielRequestBuilder } from '#src/request_builder/fiel_request_builder/fiel_request_builder';
import { QueryParameters } from '#src/services/query/query_parameters';
import { ComplementoCfdi } from '#src/shared/complemento_cfdi';
import { DateTime } from '#src/shared/date_time';
import { DateTimePeriod } from '#src/shared/date_time_period';
import { DocumentStatus } from '#src/shared/document_status';
import { DocumentType } from '#src/shared/document_type';
import { DownloadType } from '#src/shared/download_type';
import { RequestType } from '#src/shared/request_type';
import { RfcMatch } from '#src/shared/rfc_match';
import { RfcOnBehalf } from '#src/shared/rfc_on_behalf';
import { ServiceType } from '#src/shared/service_type';
import { Uuid } from '#src/shared/uuid';
import {
  createFielRequestBuilderUsingTestingFiles,
  createFielUsingTestingFiles,
  fileContents,
  xmlFormat,
} from '#tests/test_utils';

describe('fiel request builder', () => {
  test('fiel request containst given fiel', () => {
    const fiel = createFielUsingTestingFiles();
    const requestBuilder = new FielRequestBuilder(fiel);
    expect(requestBuilder.getFiel()).toBe(fiel);
  });

  test('authorization', () => {
    const requestBuilder = createFielRequestBuilderUsingTestingFiles();
    const created = DateTime.create('2019-08-01T03:38:19.000Z');
    const expires = DateTime.create('2019-08-01T03:43:19.000Z');
    const token = 'uuid-cf6c80fb-00ae-44c0-af56-54ec65decbaa-1';
    const requestBody = requestBuilder.authorization(created, expires, token);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('authenticate/request.xml')),
    );

    // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
    //     requestBody,
    //     'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
    //     'Security',
    //     ['http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'],
    //     requestBuilder.getFiel().getCertificatePemContents()
    // );
    // // check this verification.
    // expect(xmlSecVeritifaction).toBeTruthy();
  });

  const extractSecurityTokenFromXml = (requestBody: string): string => {
    const matches = /o:BinarySecurityToken u:Id="(?<id>.*?)"/u.exec(requestBody);

    return matches?.groups?.id ?? '';
  };

  test('authorization without security token uuid creates random', () => {
    const requestBuilder = createFielRequestBuilderUsingTestingFiles();
    const created = DateTime.create('2019-08-01T03:38:19.000Z');
    const expires = DateTime.create('2019-08-01T03:43:19.000Z');

    const requestBody = requestBuilder.authorization(created, expires);
    const securityTokenId = extractSecurityTokenFromXml(requestBody);

    expect(securityTokenId).not.toBe('');

    const otherRequestBody = requestBuilder.authorization(created, expires);
    const otherSecurityTokenId = extractSecurityTokenFromXml(otherRequestBody);

    expect(securityTokenId).not.toBe('');
    expect(otherSecurityTokenId).not.toBe(securityTokenId);
  });

  test('query received', () => {
    const requestBuilder = createFielRequestBuilderUsingTestingFiles();
    const parameters = QueryParameters.create()
      .withServiceType(new ServiceType('cfdi'))
      .withPeriod(DateTimePeriod.createFromValues('2019-01-01T00:00:00', '2019-01-01T00:04:00'))
      .withDownloadType(new DownloadType('received'))
      .withRequestType(new RequestType('xml'))
      .withDocumentType(new DocumentType('nomina'))
      .withComplement(new ComplementoCfdi('nomina12'))
      .withDocumentStatus(new DocumentStatus('active'))
      .withRfcOnBehalf(RfcOnBehalf.create('XXX01010199A'))
      .withRfcMatch(RfcMatch.create('AAA010101AAA'));

    const requestBody = requestBuilder.query(parameters);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('query/request-received.xml')),
    );

    // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
    //     requestBody,
    //     'http://DescargaMasivaTerceros.sat.gob.mx',
    //     'SolicitaDescarga'
    // );
    // check this verification.
    // expect(xmlSecVeritifaction).toBeTruthy();
  });

  test('query by uuid', () => {
    const requestBuilder = createFielRequestBuilderUsingTestingFiles();
    const parameters = QueryParameters.create()
      .withServiceType(new ServiceType('cfdi'))
      .withUuid(Uuid.create('96623061-61fe-49de-b298-c7156476aa8b'));

    const requestBody = requestBuilder.query(parameters);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('query/request-item.xml')),
    );

    // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
    //     requestBody,
    //     'http://DescargaMasivaTerceros.sat.gob.mx',
    //     'SolicitaDescarga'
    // );
    // check this verification.
    // expect(xmlSecVeritifaction).toBeTruthy();
  });

  test('query issued', () => {
    const requestBuilder = createFielRequestBuilderUsingTestingFiles();
    const parameters = QueryParameters.create()
      .withServiceType(new ServiceType('cfdi'))
      .withPeriod(DateTimePeriod.createFromValues('2019-01-01T00:00:00', '2019-01-01T00:04:00'))
      .withDownloadType(new DownloadType('issued'));

    const requestBody = requestBuilder.query(parameters);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('query/request-issued.xml')),
    );

    // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
    //     requestBody,
    //     'http://DescargaMasivaTerceros.sat.gob.mx',
    //     'SolicitaDescarga'
    // );
    // check this verification.
    // expect(xmlSecVeritifaction).toBeTruthy();
  });

  test('verify', () => {
    const fiel = Fiel.create(
      fileContents('fake-fiel/EKU9003173C9.cer'),
      fileContents('fake-fiel/EKU9003173C9.key'),
      fileContents('fake-fiel/EKU9003173C9-password.txt').trim(),
    );
    const requestBuilder = new FielRequestBuilder(fiel);

    const packageId = '3f30a4e1-af73-4085-8991-e4d97eef16bd';
    const requestBody = requestBuilder.verify(packageId);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('verify/request.xml')),
    );
  });

  test('verify using special invalid xml characters', () => {
    const requestId = '"&"';
    const rfc = 'E&E010101AAA';
    const issuerName = 'O=Compañía "Tú & Yo", Inc.';

    const certificate = mock<Certificate>();

    certificate.rfc.mockReturnValueOnce(rfc);
    certificate.issuerAsRfc4514.mockReturnValueOnce(issuerName);
    certificate.pem.mockReturnValueOnce('');
    const serialNumber = mock<SerialNumber>();
    serialNumber.decimal.mockReturnValue('');
    certificate.serialNumber.mockReturnValueOnce(serialNumber);
    const privateKey = mock<PrivateKey>();
    privateKey.belongsTo.mockReturnValueOnce(true);
    privateKey.sign.mockReturnValueOnce('');
    const credential = new Credential(certificate, privateKey);
    const fiel = new Fiel(credential);

    const requestBuilder = new FielRequestBuilder(fiel);
    const requestBody = requestBuilder.verify(requestId);

    const parser = getParser();

    const document: Document = parser.parseFromString(requestBody, 'text/xml');

    const selectValue = useNamespaces({
      des: 'http://DescargaMasivaTerceros.sat.gob.mx',
      xd: 'http://www.w3.org/2000/09/xmldsig#',
    });
    // @ts-expect-error misssing Node properties are not needed
    const documentElement: Node = document.documentElement!;
    let selectedValue = selectValue('//des:solicitud/@IdSolicitud', documentElement);
    if (!Array.isArray(selectedValue)) {
      throw new TypeError('selected value //des:solicitud/@IdSolicitud not found');
    }
    expect((selectedValue[0] as Attr).value).toBe(requestId);
    selectedValue = selectValue('//des:solicitud/@RfcSolicitante', documentElement);
    if (!Array.isArray(selectedValue)) {
      throw new TypeError('selected value //des:solicitud/@RfcSolicitante not found');
    }
    expect((selectedValue[0] as Attr).value).toBe(rfc);
    selectedValue = selectValue('//xd:X509IssuerName/text()', documentElement);
    if (!Array.isArray(selectedValue)) {
      throw new TypeError('selected value //xd:X509IssuerName/text() not found');
    }
    expect((selectedValue[0] as Element).nodeValue).toBe(issuerName);
  });

  test('download', () => {
    const fiel = Fiel.create(
      fileContents('fake-fiel/EKU9003173C9.cer'),
      fileContents('fake-fiel/EKU9003173C9.key'),
      fileContents('fake-fiel/EKU9003173C9-password.txt').trim(),
    );
    const requestBuilder = new FielRequestBuilder(fiel);

    const packageId = '4e80345d-917f-40bb-a98f-4a73939343c5_01';
    const requestBody = requestBuilder.download(packageId);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('download/request.xml')),
    );
  });

  test('download using special invalid xml characters', () => {
    const packageId = '"&"';
    const rfc = 'E&E010101AAA';
    const issuerName = 'O=Compañía "Tú & Yo", Inc.';

    const certificate = mock<Certificate>();

    certificate.rfc.mockReturnValueOnce(rfc);
    certificate.issuerAsRfc4514.mockReturnValueOnce(issuerName);
    certificate.pem.mockReturnValueOnce('');
    const serialNumber = mock<SerialNumber>();
    serialNumber.decimal.mockReturnValue('');
    certificate.serialNumber.mockReturnValueOnce(serialNumber);
    const privateKey = mock<PrivateKey>();
    privateKey.belongsTo.mockReturnValueOnce(true);
    privateKey.sign.mockReturnValueOnce('');
    const credential = new Credential(certificate, privateKey);
    const fiel = new Fiel(credential);

    const requestBuilder = new FielRequestBuilder(fiel);
    const requestBody = requestBuilder.download(packageId);

    const parser = getParser();

    const document = parser.parseFromString(requestBody, 'text/xml');

    const selectValue = useNamespaces({
      des: 'http://DescargaMasivaTerceros.sat.gob.mx',
      xd: 'http://www.w3.org/2000/09/xmldsig#',
    });
    // @ts-expect-error misssing Node properties are not needed
    const documentElement: Node = document.documentElement!;
    let selectedValue = selectValue('//des:peticionDescarga/@idPaquete', documentElement);
    if (!Array.isArray(selectedValue)) {
      throw new TypeError('selected value //des:peticionDescarga/@idPaquete not found');
    }
    expect((selectedValue[0] as Attr).value).toBe(packageId);
    selectedValue = selectValue('//des:peticionDescarga/@RfcSolicitante', documentElement);
    if (!Array.isArray(selectedValue)) {
      throw new TypeError('selected value //des:peticionDescarga/@RfcSolicitante not found');
    }
    expect((selectedValue[0] as Attr).value).toBe(rfc);
    selectedValue = selectValue('//xd:X509IssuerName/text()', documentElement);
    if (!Array.isArray(selectedValue)) {
      throw new TypeError('selected value //xd:X509IssuerName/text() not found');
    }
    expect((selectedValue[0] as Element).nodeValue).toBe(issuerName);
  });
});

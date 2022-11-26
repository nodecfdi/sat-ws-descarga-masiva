import { TestCase } from '../../../test-case';
import { FielRequestBuilder } from '~/request-builder/fiel-request-builder/fiel-request-builder';
import { Helpers } from '~/internal/helpers';
import { DateTime, DateTimePeriod, DownloadType, Fiel, QueryParameters, RequestType } from '~/index';
import { ServiceType } from '~/shared/service-type';
import { DocumentType } from '~/shared/document-type';
import { ComplementoCfdi } from '~/shared/complemento-cfdi';
import { DocumentStatus } from '~/shared/document-status';
import { RfcOnBehalf } from '~/shared/rfc-on-behalf';
import { RfcMatch } from '~/shared/rfc-match';
import { Uuid } from '~/shared/uuid';
import { Certificate, Credential, PrivateKey, SerialNumber } from '@nodecfdi/credentials';
import { mock } from 'jest-mock-extended';
import { getParser } from '@nodecfdi/cfdiutils-common';
import { useNamespaces } from 'xpath';
describe('Fiel request builder', () => {
    test('fiel request contains given fiel', () => {
        const fiel = TestCase.createFielUsingTestingFiles();
        const requestBuilder = new FielRequestBuilder(fiel);
        expect(requestBuilder.getFiel()).toBe(fiel);
    });

    test('authorization', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const created = DateTime.create('2019-08-01T03:38:19.000Z');
        const expires = DateTime.create('2019-08-01T03:43:19.000Z');
        const token = 'uuid-cf6c80fb-00ae-44c0-af56-54ec65decbaa-1';
        const requestBody = requestBuilder.authorization(created, expires, token);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('authenticate/request.xml'))
        );

        // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
        //     requestBody,
        //     'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
        //     'Security',
        //     ['http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'],
        //     requestBuilder.getFiel().getCertificatePemContents()
        // );
        // TODO: check this verification.
        // expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('authorization without security token uuid creates random', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
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

    function extractSecurityTokenFromXml(requestBody: string): string {
        const matches = requestBody.match(/o:BinarySecurityToken u:Id="(?<id>.*?)"/u);

        return matches?.groups?.id || '';
    }

    test('query received filters', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
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

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('query/request-received-by-filters.xml'))
        );

        // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
        //     requestBody,
        //     'http://DescargaMasivaTerceros.sat.gob.mx',
        //     'SolicitaDescarga'
        // );
        // TODO: check this verification.
        // expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('query received by uuid', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const parameters = QueryParameters.create()
            .withServiceType(new ServiceType('cfdi'))
            .withUuid(Uuid.create('96623061-61fe-49de-b298-c7156476aa8b'));

        const requestBody = requestBuilder.query(parameters);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('query/request-received-by-uuid.xml'))
        );

        // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
        //     requestBody,
        //     'http://DescargaMasivaTerceros.sat.gob.mx',
        //     'SolicitaDescarga'
        // );
        // TODO: check this verification.
        // expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('query issued', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const parameters = QueryParameters.create()
            .withServiceType(new ServiceType('cfdi'))
            .withPeriod(DateTimePeriod.createFromValues('2019-01-01T00:00:00', '2019-01-01T00:04:00'))
            .withDownloadType(new DownloadType('issued'));

        const requestBody = requestBuilder.query(parameters);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('query/request-issued.xml'))
        );

        // const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
        //     requestBody,
        //     'http://DescargaMasivaTerceros.sat.gob.mx',
        //     'SolicitaDescarga'
        // );
        // TODO: check this verification.
        // expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('verify', async () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-fiel/EKU9003173C9.cer'),
            TestCase.fileContents('fake-fiel/EKU9003173C9.key'),
            TestCase.fileContents('fake-fiel/EKU9003173C9-password.txt').trim()
        );
        const requestBuilder = new FielRequestBuilder(fiel);

        const packageId = '3f30a4e1-af73-4085-8991-e4d97eef16bd';
        const requestBody = requestBuilder.verify(packageId);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('verify/request.xml'))
        );
    });

    test('verify using special invalid xml characters', async () => {
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

        const document = parser.parseFromString(requestBody, 'text/xml');

        const selectVal = useNamespaces({
            des: 'http://DescargaMasivaTerceros.sat.gob.mx',
            xd: 'http://www.w3.org/2000/09/xmldsig#'
        });
        expect((selectVal('//des:solicitud/@IdSolicitud', document.documentElement)[0] as Attr).value).toBe(requestId);
        expect((selectVal('//des:solicitud/@RfcSolicitante', document.documentElement)[0] as Attr).value).toBe(rfc);
        expect((selectVal('//xd:X509IssuerName/text()', document.documentElement)[0] as Element).nodeValue).toBe(
            issuerName
        );
    });

    test('download', async () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-fiel/EKU9003173C9.cer'),
            TestCase.fileContents('fake-fiel/EKU9003173C9.key'),
            TestCase.fileContents('fake-fiel/EKU9003173C9-password.txt').trim()
        );
        const requestBuilder = new FielRequestBuilder(fiel);

        const packageId = '4e80345d-917f-40bb-a98f-4a73939343c5_01';
        const requestBody = requestBuilder.download(packageId);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('download/request.xml'))
        );
    });

    test('download using special invalid xml characters', async () => {
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

        const selectVal = useNamespaces({
            des: 'http://DescargaMasivaTerceros.sat.gob.mx',
            xd: 'http://www.w3.org/2000/09/xmldsig#'
        });
        expect((selectVal('//des:peticionDescarga/@idPaquete', document.documentElement)[0] as Attr).value).toBe(
            packageId
        );
        expect((selectVal('//des:peticionDescarga/@RfcSolicitante', document.documentElement)[0] as Attr).value).toBe(
            rfc
        );
        expect((selectVal('//xd:X509IssuerName/text()', document.documentElement)[0] as Element).nodeValue).toBe(
            issuerName
        );
    });
});

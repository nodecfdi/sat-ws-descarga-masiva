import { TestCase } from '../../../test-case';
import { FielRequestBuilder } from '../../../../src/request-builder/fiel-request-builder/fiel-request-builder';
import { EnvelopSignatureVerifier } from './envelop-signature-verifier';
import { Helpers } from '../../../../src/internal/helpers';
import { Fiel } from '../../../../src';
describe('Fiel request builder', () => {
    function extractSecurityTokenFromXml(requestBody: string): string {
        const matches = requestBody.match(/o:BinarySecurityToken u:Id="(?<id>.*?)"/u);

        return matches?.groups?.id || '';
    }
    test('fiel request contains given fiel and implements RequestBuilderInterface', () => {
        const fiel = TestCase.createFielUsingTestingFiles();
        const requestBuilder = new FielRequestBuilder(fiel);
        expect(requestBuilder.getFiel()).toBe(fiel);
        // as we cant check interface we check that have given property
        expect(requestBuilder).toHaveProperty('USE_SIGNER');
    });

    test('fiel request contain given fiel', () => {
        const fiel = TestCase.createFielUsingTestingFiles();
        const requestBuilder = new FielRequestBuilder(fiel);
        expect(requestBuilder.getFiel()).toBe(fiel);
    });

    test('authorization', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const created = '2019-08-01T03:38:19.000Z';
        const expires = '2019-08-01T03:43:19.000Z';
        const token = 'uuid-cf6c80fb-00ae-44c0-af56-54ec65decbaa-1';
        const requestBody = requestBuilder.authorization(created, expires, token);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('authenticate/request.xml'))
        );

        const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
            requestBody,
            'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
            'Security',
            ['http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'],
            requestBuilder.getFiel().getCertificatePemContents()
        );
        // TODO: check this verification.
        expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('authorization without security token uuid creates random', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const created = '2019-08-01T03:38:19.000Z';
        const expires = '2019-08-01T03:43:19.000Z';

        const requestBody = requestBuilder.authorization(created, expires);
        const securityTokenId = extractSecurityTokenFromXml(requestBody);

        expect(securityTokenId).not.toBe('');

        const otherRequestBody = requestBuilder.authorization(created, expires);
        const otherSecurityTokenId = extractSecurityTokenFromXml(otherRequestBody);

        expect(securityTokenId).not.toBe('');
        expect(otherSecurityTokenId).not.toBe(securityTokenId);
    });

    test('query received', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const start = '2019-01-01T00:00:00';
        const end = '2019-01-01T00:04:00';
        const rfcIssuer = '';
        const rfcReceiver = '*'; // same as signer
        const requestType = 'CFDI';
        const requestBody = requestBuilder.query(start, end, rfcIssuer, rfcReceiver, requestType);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('query/request-received.xml'))
        );

        const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
            requestBody,
            'http://DescargaMasivaTerceros.sat.gob.mx',
            'SolicitaDescarga'
        );
        // TODO: check this verification.
        expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('query issued', async () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const start = '2019-01-01T00:00:00';
        const end = '2019-01-01T00:04:00';
        const rfcIssuer = '*'; // same as signer
        const rfcReceiver = '';
        const requestType = 'CFDI';
        const requestBody = requestBuilder.query(start, end, rfcIssuer, rfcReceiver, requestType);

        expect(Helpers.nospaces(TestCase.xmlFormat(requestBody))).toBe(
            Helpers.nospaces(TestCase.fileContents('query/request-issued.xml'))
        );

        const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
            requestBody,
            'http://DescargaMasivaTerceros.sat.gob.mx',
            'SolicitaDescarga'
        );
        // TODO: check this verification.
        expect(xmlSecVeritifaction).toBeTruthy();
    });

    test('query with invalid start date', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const invalideDate = '2019-01-01 00:00:00'; // contains an space instead of T
        const valideDate = '2019-01-01T00:00:00';

        expect(() =>
            requestBuilder.query(invalideDate, valideDate, requestBuilder.USE_SIGNER, '', 'CFDI')
        ).toThrowError('The start date time "2019-01-01 00:00:00" does not have the correct format');
    });

    test('query with invalid end date', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const invalideDate = '2019-01-01 00:00:00'; // contains an space instead of T
        const valideDate = '2019-01-01T00:00:00';

        expect(() =>
            requestBuilder.query(valideDate, invalideDate, requestBuilder.USE_SIGNER, '', 'CFDI')
        ).toThrowError('The end date time "2019-01-01 00:00:00" does not have the correct format');
    });

    test('query with start greater than end', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const lower = '2019-01-01T00:00:00';
        const upper = '2019-01-01T00:00:01';

        expect(() => requestBuilder.query(upper, lower, requestBuilder.USE_SIGNER, '', 'CFDI')).toThrow(
            'The period start "2019-01-01T00:00:01" is greater than end "2019-01-01T00:00:00"'
        );
    });

    test('query with empty issuer receiver', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const date = '2019-01-01T00:00:00';
        const requestType = 'CFDI';

        expect(() => requestBuilder.query(date, date, '', '', requestType)).toThrow(
            'The RFC issuer and RFC receiver are empty'
        );
    });

    test('query with issuer receiver not signer', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const date = '2019-01-01T00:00:00';
        const requestType = 'CFDI';

        expect(() => requestBuilder.query(date, date, 'FOO', 'BAR', requestType)).toThrow(
            'The RFC "EKU9003173C9" must be the issuer "FOO" or receiver "BAR"'
        );
    });

    test('query with invalide request type', () => {
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const date = '2019-01-01T00:00:00';

        expect(() => requestBuilder.query(date, date, requestBuilder.USE_SIGNER, '', 'cfdi')).toThrowError(
            'The request type "cfdi" is not CFDI or Metadata'
        );
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

        const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
            requestBody,
            'http://DescargaMasivaTerceros.sat.gob.mx',
            'VerificaSolicitudDescarga'
        );
        // TODO: check this verification.
        expect(xmlSecVeritifaction).toBeTruthy();
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

        const xmlSecVeritifaction = await new EnvelopSignatureVerifier().verify(
            requestBody,
            'http://DescargaMasivaTerceros.sat.gob.mx',
            'PeticionDescargaMasivaTercerosEntrada'
        );
        // TODO: check this verification.
        expect(xmlSecVeritifaction).toBeTruthy();
    });
});

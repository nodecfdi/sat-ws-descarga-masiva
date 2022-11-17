import { Certificate, PrivateKey, SatTypeEnum, Credential } from '@nodecfdi/credentials';
import { mock } from 'jest-mock-extended';
import { Fiel } from '~/index';
import { TestCase } from '../../../test-case';

describe('Fiel', () => {
    test('fiel with incorrect password create an error', () => {
        expect(() => TestCase.createFielUsingTestingFiles('invalid password')).toThrow(Error);
    });

    test('fiel with correct password', () => {
        const fiel = TestCase.createFielUsingTestingFiles();
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel unprotected pem', () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-fiel/EKU9003173C9.cer'),
            TestCase.fileContents('fake-fiel/EKU9003173C9.key.pem'),
            ''
        );
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel creating from contents', () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-fiel/EKU9003173C9.cer'),
            TestCase.fileContents('fake-fiel/EKU9003173C9.key'),
            TestCase.fileContents('fake-fiel/EKU9003173C9-password.txt').trim()
        );
        expect(fiel.isValid()).toBeTruthy();
    });

    test('is not valid using csd', () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-csd/EKU9003173C9.cer'),
            TestCase.fileContents('fake-csd/EKU9003173C9.key'),
            TestCase.fileContents('fake-csd/EKU9003173C9-password.txt').trim()
        );
        expect(fiel.isValid()).toBeFalsy();
    });

    test('is not valid expired certificate', () => {
        const certificate = mock<Certificate>();
        certificate.satType.mockReturnValue(new SatTypeEnum('FIEL'));
        certificate.validOn.mockReturnValue(false);
        const privateKey = mock<PrivateKey>();
        privateKey.belongsTo.mockReturnValue(true);
        const credential = new Credential(certificate, privateKey);
        const fiel = new Fiel(credential);
        expect(fiel.isValid()).toBeFalsy();
    });
});

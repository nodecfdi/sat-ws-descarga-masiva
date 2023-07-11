import {
    type Certificate,
    type PrivateKey,
    SatTypeEnum,
    Credential,
} from '@nodecfdi/credentials';
import { mock } from 'vitest-mock-extended';
import { useTestCase } from '../../../test-case';
import { Fiel } from 'src/index';

describe('Fiel', () => {
    const { createFielUsingTestingFiles, fileContents } = useTestCase();
    test('fiel with incorrect password create an error', () => {
        expect(() => createFielUsingTestingFiles('invalid password')).toThrow(
            Error
        );
    });

    test('fiel with correct password', () => {
        const fiel = createFielUsingTestingFiles();
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel unprotected pem', () => {
        const fiel = Fiel.create(
            fileContents('fake-fiel/EKU9003173C9.cer'),
            fileContents('fake-fiel/EKU9003173C9.key.pem'),
            ''
        );
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel creating from contents', () => {
        const fiel = Fiel.create(
            fileContents('fake-fiel/EKU9003173C9.cer'),
            fileContents('fake-fiel/EKU9003173C9.key'),
            fileContents('fake-fiel/EKU9003173C9-password.txt').trim()
        );
        expect(fiel.isValid()).toBeTruthy();
    });

    test('is not valid using csd', () => {
        const fiel = Fiel.create(
            fileContents('fake-csd/EKU9003173C9.cer'),
            fileContents('fake-csd/EKU9003173C9.key'),
            fileContents('fake-csd/EKU9003173C9-password.txt').trim()
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

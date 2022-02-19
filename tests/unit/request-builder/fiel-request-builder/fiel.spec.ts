import { Fiel } from '../../../../src';
import { TestCase } from '../../../test-case';

describe('Fiel', () => {

    test('fiel with correct password', () => {
        const fiel = TestCase.createFielUsingTestingFiles();
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel unprotected pem', () => {
        const fiel = Fiel.create(TestCase.fileContents('fake-fiel/EKU9003173C9.cer'), TestCase.fileContents('fake-fiel/EKU9003173C9.key.pem'), '');
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel creating from content', () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-fiel/EKU9003173C9.cer'),
            TestCase.fileContents('fake-fiel/EKU9003173C9.key'),
            TestCase.fileContents('fake-fiel/EKU9003173C9-password.txt').trim(),
        );
        expect(fiel.isValid()).toBeTruthy();
    });
    test('fiel with incorrect password create an exception ', () => {
        expect(() => { TestCase.createFielUsingTestingFiles('wrong password') }).toThrow(new Error('Cannot open private key: malformed plain PKCS8 private key(code:001)'));
    });
    test('is not valid using CSD', () => {
        const fiel = Fiel.create(
            TestCase.fileContents('fake-csd/EKU9003173C9.cer'),
            TestCase.fileContents('fake-csd/EKU9003173C9.key'),
            TestCase.fileContents('fake-csd/EKU9003173C9-password.txt').trim(),
        );
        expect(fiel.isValid()).toBeFalsy();
    });


});

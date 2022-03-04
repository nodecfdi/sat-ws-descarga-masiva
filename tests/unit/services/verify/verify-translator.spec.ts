import { TestCase } from '../../../test-case';
import { Helpers } from '../../../../src/internal/helpers';
import { VerifyTranslator } from '../../../../src/services/verify/verify-translator';
describe('verify translator', () => {
    test('create verify result from soap response with zero packages', () => {
        const expectedStatusCode = 5000;
        const expectedStatusRequest = 5;
        const expectedCodeRequest = 5004;
        const expectedNumberCfdis = 0;
        const expectedMessage = 'Solicitud Aceptada';
        const expectedPackagesIds: string[] = [];

        const translator = new VerifyTranslator();
        const responseBody = Helpers.nospaces(TestCase.fileContents('verify/response-0-packages.xml'));
        
        const result = translator.createVerifyResultFromSoapResponse(responseBody);
        const status = result.getStatus();
        const statusRequest = result.getStatusRequest();
        const codeRequest = result.getCodeRequest();

        expect(status.isAccepted()).toBeTruthy();
        expect(status.getCode()).toBe(expectedStatusCode);
        expect(status.getMessage()).toBe(expectedMessage);
        expect(statusRequest.getValue()).toBe(expectedStatusRequest);
        expect(statusRequest.getEntryId() == 'Rejected').toBeTruthy();
        expect(codeRequest.getValue()).toBe(expectedCodeRequest);
        expect(codeRequest.getEntryId() == 'EmptyResult').toBeTruthy();
        expect(result.getNumberCfdis()).toBe(expectedNumberCfdis);
        expect(result.getPackageIds()).toStrictEqual(expectedPackagesIds);
    });

    test('create verify result from soap response with two package', () => {
        const expectedPackagesIds = [
            '4e80345d-917f-40bb-a98f-4a73939343c5_01',
            '4e80345d-917f-40bb-a98f-4a73939343c5_02',
        ];

        const translator = new VerifyTranslator();
        const responseBody = Helpers.nospaces(TestCase.fileContents('verify/response-2-packages.xml'));

        const result = translator.createVerifyResultFromSoapResponse(responseBody);

        expect(result.getPackageIds()).toStrictEqual(expectedPackagesIds);
        expect(result.countPackages()).toBe(2);
    });

    test('create soap request', () => {
        const translator = new VerifyTranslator();
        const requestBuilder = TestCase.createFielRequestBuilderUsingTestingFiles();
        const requestId = '3f30a4e1-af73-4085-8991-e4d97eef16bd';

        const requestBody = translator.createSoapRequest(requestBuilder, requestId);

        expect(TestCase.xmlFormat(requestBody)).toBe(Helpers.nospaces(TestCase.fileContents('verify/request.xml')));
    });
});

import { StatusCode } from '../../../../src/shared/status-code';
import { StatusRequest } from '../../../../src/shared/status-request';
import { CodeRequest } from '../../../../src/shared/code-request';
import { VerifyResult } from '../../../../src/services/verify/verify-result';
import { TestCase } from '../../../test-case';
describe('verify result', () => {
    test('properties', () => {
        const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
        const statusRequest = new StatusRequest(2);
        const codeRequest = new CodeRequest(5003);
        const numberCfdis = 1000;
        const packageIds = ['x-package-1', 'x-package-2'];

        const result = new VerifyResult(statusCode, statusRequest, codeRequest, numberCfdis, ...packageIds);

        expect(result.getStatus()).toBe(statusCode);
        expect(result.getStatusRequest()).toBe(statusRequest);
        expect(result.getCodeRequest()).toBe(codeRequest);
        expect(result.getNumberCfdis()).toBe(numberCfdis);
        expect(result.getPackageIds()).toStrictEqual(packageIds);
    });

    test('json', () => {
        const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
        const statusRequest = new StatusRequest(3);
        const codeRequest = new CodeRequest(5003);
        
        const numberCfdis = 1000;
        const packageIds = ['x-package-1', 'x-package-2'];

        const result = new VerifyResult(statusCode, statusRequest, codeRequest, numberCfdis, ...packageIds);

        const expectedFile = TestCase.fileContents('json/verify-result.json', 'utf8');

        expect(JSON.stringify(result.jsonSerialize())).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

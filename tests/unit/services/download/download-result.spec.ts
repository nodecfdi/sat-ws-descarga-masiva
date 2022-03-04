import { StatusCode } from '../../../../src/shared/status-code';
import { DownloadResult } from '../../../../src/services/download/download-result';
import { TestCase } from '../../../test-case';
describe('download result', () => {
    test('porperties', () => {
        const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
        const packageContent = 'x-content';

        const result = new DownloadResult(statusCode, packageContent);

        expect(result.getStatus()).toBe(statusCode);
        expect(result.getPackageContent()).toBe(packageContent);
        expect(result.getPackageLenght()).toBe(packageContent.length);
    });

    test('json', () => {
        const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
        const packageContent = 'x-content';

        const result = new DownloadResult(statusCode, packageContent);

        const expectedFile = TestCase.fileContents('json/download-result.json');

        expect(JSON.stringify(result.jsonSerialize())).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

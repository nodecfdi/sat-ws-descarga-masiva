import { StatusCode } from '~/shared/status-code';
import { DownloadResult } from '~/services/download/download-result';
import { TestCase } from '../../../test-case';
describe('download result', () => {
    test('properties', () => {
        const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
        const packageContent = 'x-content';
        const packageSize = packageContent.length;

        const result = new DownloadResult(statusCode, packageContent);

        expect(result.getStatus()).toBe(statusCode);
        expect(result.getPackageContent()).toBe(packageContent);
        expect(result.getPackageSize()).toBe(packageSize);
    });

    test('json', () => {
        const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
        const packageContent = 'x-content';

        const result = new DownloadResult(statusCode, packageContent);

        const expectedFile = TestCase.fileContents('json/download-result.json');

        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

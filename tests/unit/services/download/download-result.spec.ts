import { useTestCase } from '../../../test-case';
import { StatusCode } from 'src/shared/status-code';
import { DownloadResult } from 'src/services/download/download-result';

describe('download result', () => {
    const { fileContents } = useTestCase();
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

        const expectedFile = fileContents('json/download-result.json');

        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

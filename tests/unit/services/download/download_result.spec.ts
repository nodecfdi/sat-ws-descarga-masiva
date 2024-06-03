import { DownloadResult } from '#src/services/download/download_result';
import { StatusCode } from '#src/shared/status_code';
import { fileContents } from '#tests/test_utils';

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

    const expectedFile = fileContents('json/download-result.json');

    expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(expectedFile)));
  });
});

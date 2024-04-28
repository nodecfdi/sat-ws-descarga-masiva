import { Helpers } from '#src/internal/helpers';
import { DownloadTranslator } from '#src/services/download/download-translator';
import { useTestCase } from '../../../test-case.js';

describe('download translator', () => {
  const { fileContents, createFielRequestBuilderUsingTestingFiles, xmlFormat } = useTestCase();
  test('create download result from soap response with package', () => {
    const expectedStatusCode = 5000;
    const expectedMessage = 'Solicitud Aceptada';

    const translator = new DownloadTranslator();
    const responseBody = Helpers.nospaces(fileContents('download/response-with-package.xml'));

    const result = translator.createDownloadResultFromSoapResponse(responseBody);
    const status = result.getStatus();

    expect(result.getPackageSize()).toBeGreaterThan(0);
    expect(result.getPackageContent()).not.toBe('');
    expect(status.getCode()).toBe(expectedStatusCode);
    expect(status.getMessage()).toBe(expectedMessage);
    expect(status.isAccepted()).toBeTruthy();
  });

  test('create soap request', () => {
    const translator = new DownloadTranslator();
    const requestBuilder = createFielRequestBuilderUsingTestingFiles();
    const packageId = '4e80345d-917f-40bb-a98f-4a73939343c5_01';

    const requestBody = translator.createSoapRequest(requestBuilder, packageId);

    expect(Helpers.nospaces(xmlFormat(requestBody))).toBe(
      Helpers.nospaces(fileContents('download/request.xml')),
    );
  });
});

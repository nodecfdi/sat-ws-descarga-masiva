import { OpenZipFileException } from '~/package-reader/exceptions/open-zip-file-exception';
describe('open zip file exception', () => {
    test('properties', () => {
        const filename = 'filename';
        const code = 3;
        const previous = new Error();
        const exception = OpenZipFileException.create(filename, code, previous);
        expect(exception.message).toContain('Unable to open Zip file');
        expect(exception.getFileName()).toBe(filename);
        expect(exception.getCode()).toBe(code);
        expect(exception.getPrevious()).toBe(previous);
    });
});

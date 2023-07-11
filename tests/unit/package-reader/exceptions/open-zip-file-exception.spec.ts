import { OpenZipFileException } from 'src/package-reader/exceptions/open-zip-file-exception';

describe('open zip file exception', () => {
    test('properties', () => {
        const filename = 'filename';
        const code = 3;
        const previous = new Error('algo');
        const exception = OpenZipFileException.create(filename, code, previous);
        expect(exception.message).toContain('Unable to open Zip file');
        expect(exception.getFileName()).toBe(filename);
        expect(exception.getCode()).toBe(code);
        expect(exception.getPrevious()).toBe(previous);
    });
});

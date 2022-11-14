import { CreateTemporaryZipFileException } from '~/package-reader/exceptions/create-temporary-file-zip-exception';
describe('temporary zip file exception', () => {
    test('properties', () => {
        const message = 'x-message';
        const previous = new Error();
        const exception = CreateTemporaryZipFileException.create(message, previous);
        expect(exception.message).toBe(message);
        expect(exception.getPrevious()).toBe(previous);
    });
});

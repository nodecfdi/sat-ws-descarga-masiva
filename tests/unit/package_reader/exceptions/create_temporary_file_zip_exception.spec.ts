import { CreateTemporaryZipFileException } from '#src/package_reader/exceptions/create_temporary_file_zip_exception';

describe('temporary zip file exception', () => {
  test('properties', () => {
    const message = 'x-message';
    const previous = new Error('algo');
    const exception = CreateTemporaryZipFileException.create(message, previous);
    expect(exception.message).toBe(`${message} : algo`);
    expect(exception.getPrevious()).toBe(previous);
  });
});

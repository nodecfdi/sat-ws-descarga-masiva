import { MetadataItem } from '~/package-reader/metadata-item';
import { MetadataPackageReader } from '~/package-reader/metadata-package-reader';
import { TestCase } from '../../test-case';
describe('metadata item', () => {
    test('with empty data', () => {
        const metadata = new MetadataItem({});
        expect(metadata.get('uuid')).toBe('');
        expect([...metadata]).toEqual([]);
        expect(metadata.all()).toStrictEqual({});
    });

    test('with contents', () => {
        const data = { uuid: 'x-uuid', oneData: 'one data' };
        const metadata = new MetadataItem(data);
        expect(metadata.get('uuid')).toBe('x-uuid');
        expect(metadata.get('oneData')).toBe('one data');
        expect(metadata.all()).toStrictEqual(data);
    });

    test('reader cfdi in zip', async () => {
        let expectedContent = TestCase.fileContents('zip/metadata.txt');
        const zipFileName = TestCase.filePath('zip/metadata.zip');
        const packageReader = await MetadataPackageReader.createFromFile(zipFileName);
        let extracted = '';
        for await (const item of packageReader.fileContents()) {
            for (const map of item) {
                extracted = map[1];
                break;
            }
        }

        // normalize line endings
        expectedContent = expectedContent.replace(new RegExp(/\r\n/, 'g'), '\n');
        extracted = extracted.replace(new RegExp(/\r\n/, 'g'), '\n');

        expect(extracted).toBe(expectedContent);
    });
});

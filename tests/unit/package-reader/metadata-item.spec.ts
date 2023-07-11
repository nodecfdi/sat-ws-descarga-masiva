import { useTestCase } from '../../test-case';
import { MetadataItem } from 'src/package-reader/metadata-item';
import { MetadataPackageReader } from 'src/package-reader/metadata-package-reader';

describe('metadata item', () => {
    const { fileContents, filePath } = useTestCase();
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
        let expectedContent = fileContents('zip/metadata.txt');
        const zipFileName = filePath('zip/metadata.zip');
        const packageReader = await MetadataPackageReader.createFromFile(
            zipFileName
        );
        let extracted = '';
        for await (const item of packageReader.fileContents()) {
            for (const map of item) {
                extracted = map[1];
            }
        }

        // normalize line endings
        expectedContent = expectedContent.replaceAll('\r\n', '\n');
        extracted = extracted.replaceAll('\r\n', '\n');

        expect(extracted).toBe(expectedContent);
    });
});

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { mock } from 'vitest-mock-extended';
import { useTestCase } from '../../../test-case';
import { CsvReader } from 'src/package-reader/internal/csv-reader';
import { ThirdPartiesExtractor } from 'src/package-reader/internal/third-parties-extractor';
import { type PackageReaderInterface } from 'src/package-reader/package-reader-interface';
import { FilteredPackageReader } from 'src/package-reader/internal/filtered-package-reader';
import { NullFileFilter } from 'src/package-reader/internal/file-filters/null-file-filter';

describe('Third parties extractor', () => {
    const { filePath } = useTestCase();

    test('extractor', async () => {
        const sourcePath = filePath('zip/metadata-extractor.txt');
        const expected = [
            {
                '00000000-AAAA-BBBB-1111-000000000001': {
                    RfcACuentaTerceros: 'AAAA010101AAA',
                    NombreACuentaTerceros: 'Registro de ejemplo 1',
                },
            },
            {
                '00000000-AAAA-BBBB-1111-000000000002': {
                    RfcACuentaTerceros: 'AAAA010102AAA',
                    NombreACuentaTerceros: 'Registro de ejemplo 2',
                },
            },
            {
                '00000000-AAAA-BBBB-1111-000000000003': {
                    RfcACuentaTerceros: 'AAAA010103AAA',
                    NombreACuentaTerceros: 'Registro de ejemplo 3',
                },
            },
        ];
        const iterator = createInterface({
            input: createReadStream(sourcePath),
            crlfDelay: Number.POSITIVE_INFINITY,
        });
        const extractor = new ThirdPartiesExtractor(new CsvReader(iterator));
        const resultArray = [];
        for await (const iterator of extractor.eachRecord()) {
            for (const [key, value] of iterator) {
                resultArray.push({ [key]: value });
            }
        }

        expect(resultArray).toStrictEqual(expected);
    });

    test('empty uuid is ignored', async () => {
        const sourcePath = filePath('zip/metadata-empty-uuid.txt');
        const expected = {};
        const iterator = createInterface({
            input: createReadStream(sourcePath),
            crlfDelay: Number.POSITIVE_INFINITY,
        });
        const extractor = new ThirdPartiesExtractor(new CsvReader(iterator));
        const result = new Map();
        for await (const iterator of extractor.eachRecord()) {
            for (const item of iterator) {
                result.set(...item);
            }
        }

        expect(Object.fromEntries(result)).toStrictEqual(expected);
    });

    test('create from package reader not filtered package reader', async () => {
        const packageReader = mock<PackageReaderInterface>();
        const result = async (): Promise<ThirdPartiesExtractor> =>
            ThirdPartiesExtractor.createFromPackageReader(packageReader);
        await expect(result).rejects.toThrow('PackageReader parameter must be a FilteredPackageReader');
    });

    test('create from package reader restore filter', async () => {
        const packageReader = await FilteredPackageReader.createFromFile(filePath('zip/metadata.zip'));
        const filter = new NullFileFilter();
        packageReader.setFilter(filter);

        await ThirdPartiesExtractor.createFromPackageReader(packageReader);
        expect(packageReader.getFilter()).toBe(filter);
    });
});

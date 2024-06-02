import { createReadStream } from 'node:fs';
import * as readline from 'node:readline';
import { mock } from 'vitest-mock-extended';
import { CsvReader } from '#src/package_reader/internal/csv_reader';
import { NullFileFilter } from '#src/package_reader/internal/file_filters/null_file_filter';
import { FilteredPackageReader } from '#src/package_reader/internal/filtered_package_reader';
import { ThirdPartiesExtractor } from '#src/package_reader/internal/third_parties_extractor';
import { type PackageReaderInterface } from '#src/package_reader/package_reader_interface';
import { filePath } from '#tests/test_utils';

describe('third parties extractor', () => {

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
    const iterator = readline.createInterface({
      input: createReadStream(sourcePath),
      crlfDelay: Number.POSITIVE_INFINITY,
    });
    const extractor = new ThirdPartiesExtractor(new CsvReader(iterator));
    const resultArray = [];
    for await (const forIterator of extractor.eachRecord()) {
      for (const [key, value] of forIterator) {
        resultArray.push({ [key]: value });
      }
    }

    expect(resultArray).toStrictEqual(expected);
  });

  test('empty uuid is ignored', async () => {
    const sourcePath = filePath('zip/metadata-empty-uuid.txt');
    const expected = {};
    const iterator = readline.createInterface({
      input: createReadStream(sourcePath),
      crlfDelay: Number.POSITIVE_INFINITY,
    });
    const extractor = new ThirdPartiesExtractor(new CsvReader(iterator));
    const result = new Map();
    for await (const forIterator of extractor.eachRecord()) {
      for (const item of forIterator) {
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

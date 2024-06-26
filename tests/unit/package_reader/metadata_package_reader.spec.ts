import { MetadataPackageReader } from '#src/package_reader/metadata_package_reader';
import { fileContents, filePath } from '#tests/test_utils';
/**
 * This tests uses the Zip file located at tests/_files/zip/metadata.zip that contains:
 *
 * __MACOSX/ // commonly generated by MacOS when open the file
 * __MACOSX/._45C5C344-DA01-497A-9271-5AA3852EE6AE_01.txt // commonly generated by MacOS when open the file
 * 00000000-0000-0000-0000-000000000000_00.txt // file with correct name but not a metadata file
 * 45C5C344-DA01-497A-9271-5AA3852EE6AE_01.txt // file with metadata 2 rows
 * empty-file // zero bytes file
 * other.txt // file with incorrect extension and incorrect content
 */
describe('metadata package reader', () => {
  test('count all contents', async () => {
    const expectedNumberFiles = 1;
    const expectedNUmberRows = 2;

    const filename = filePath('zip/metadata.zip');
    const metadataPackageReader = await MetadataPackageReader.createFromFile(filename);

    const content = await metadataPackageReader.metadataToArray();

    await expect(metadataPackageReader.count()).resolves.toBe(expectedNumberFiles);
    expect(content).toHaveLength(expectedNUmberRows);
  });

  test('retrieve metadata contents', async () => {
    const filename = filePath('zip/metadata.zip');
    const metadataPackageReader = await MetadataPackageReader.createFromFile(filename);
    const metadata = await metadataPackageReader.metadataToArray();

    expect(metadata).toHaveLength(2);

    const extracted: string[] = [];

    for (const item of metadata) {
      extracted.push(item.get('uuid'));
    }

    const expected = [
      'E7215E3B-2DC5-4A40-AB10-C902FF9258DF',
      '129C4D12-1415-4ACE-BE12-34E71C4EAB4E',
    ];

    expect(extracted).toStrictEqual(expected);
  });

  test('create from file and contents', async () => {
    const filename = filePath('zip/metadata.zip');
    const first = await MetadataPackageReader.createFromFile(filename);

    expect(first.getFilename()).toBe(filename);

    const contents = fileContents('zip/metadata.zip');
    const second = await MetadataPackageReader.createFromContents(contents);
    const metadata1 = await first.metadataToArray();
    const metadata2 = await second.metadataToArray();

    expect(metadata1).toStrictEqual(metadata2);
  });

  test('metadata package reader with third parties', async () => {
    /*
     * The file zip/metadata-terceros.zip is specially crafted,
     * It contains 4 metadata records and also a third parties file with
     * with 3 references, unsorted, with different upper and lower cases.
     */
    const zipFilename = filePath('zip/metadata-terceros.zip');

    const packageReader = await MetadataPackageReader.createFromFile(zipFilename);
    const extracted: Record<string, string>[] = [];

    const values = await packageReader.metadataToArray();

    for (const item of values) {
      extracted.push({
        uuid: item.get('uuid').toLowerCase(),
        rfcACuentaTerceros: item.get('rfcACuentaTerceros'),
        nombreACuentaTerceros: item.get('nombreACuentaTerceros'),
      });
    }

    const expectedRecords = [
      {
        uuid: '11111111-aaaa-bbbb-0000-000000000001',
        rfcACuentaTerceros: '',
        nombreACuentaTerceros: '',
      },
      {
        uuid: '11111111-aaaa-bbbb-0000-000000000002',
        rfcACuentaTerceros: 'AAAA010101AA1',
        nombreACuentaTerceros: 'PERSONA FISICA UNO',
      },
      {
        uuid: '11111111-aaaa-bbbb-0000-000000000003',
        rfcACuentaTerceros: 'AAAA010101AA2',
        nombreACuentaTerceros: 'PERSONA FISICA DOS',
      },
      {
        uuid: '11111111-aaaa-bbbb-0000-000000000004',
        rfcACuentaTerceros: 'AAAA010101AA3',
        nombreACuentaTerceros: 'PERSONA FISICA TRES',
      },
      {
        uuid: '11111111-aaaa-bbbb-0000-000000000005',
        rfcACuentaTerceros: '',
        nombreACuentaTerceros: '',
      },
    ];
    expect(extracted).toStrictEqual(expectedRecords);
  });

  test('json', async () => {
    const zipFilename = filePath('zip/metadata.zip');
    const packageReader = await MetadataPackageReader.createFromFile(zipFilename);

    // assert fileName
    const jsonData = await packageReader.jsonSerialize();
    expect(jsonData.source).toBe(zipFilename);

    // assert file contents
    const expectedFiles = ['45C5C344-DA01-497A-9271-5AA3852EE6AE_01.txt'];
    const jsonDataFiles = jsonData.files;
    expect(Object.keys(jsonDataFiles)).toStrictEqual(expectedFiles);

    // assert metadataItems
    const expectedMetadata = [
      'E7215E3B-2DC5-4A40-AB10-C902FF9258DF',
      '129C4D12-1415-4ACE-BE12-34E71C4EAB4E',
    ];
    const jsonDataMetadata = jsonData.metadata;
    expect(Object.keys(jsonDataMetadata)).toStrictEqual(expectedMetadata);
  });

  test('metadata json', async () => {
    const zipFilename = filePath('zip/metadata.zip');
    const packageReader = await MetadataPackageReader.createFromFile(zipFilename);

    const expectedFile = JSON.parse(fileContents('zip/metadata.json')) as Record<string, unknown>;

    const map = Object.entries(expectedFile);
    const metadata = await packageReader.metadataToArray();

    let i = 0;
    for (const item of metadata) {
      expect(map[i][0]).toBe(item.get('uuid'));
      expect(map[i][1]).toStrictEqual(item.all());
      i += 1;
    }
  });
});

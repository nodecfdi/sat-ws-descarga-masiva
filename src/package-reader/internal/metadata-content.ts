import { MetadataItem } from '../metadata-item.js';
import { MetadataPreprocessor } from './metadata-preprocessor.js';
import { CsvReader } from './csv-reader.js';
import { ThirdPartiesRecords } from './third-parties-records.js';

export class MetadataContent {
  /**
   * The iterator will be used in a foreach loop to create MetadataItems
   * The first iteration must contain an array of header names that will be renames to lower case first letter
   * The next iterations must contain an array with data
   */
  constructor(
    private readonly _csvReader: CsvReader,
    private readonly _thirdParties: ThirdPartiesRecords,
  ) {}

  /**
   * This method fix the content and create a SplTempFileObject to store the information
   */
  public static createFromContents(
    contents: string,
    thirdParties?: ThirdPartiesRecords | undefined,
  ): MetadataContent {
    thirdParties = thirdParties ?? ThirdPartiesRecords.createEmpty();
    // fix known errors on metadata text file
    const preprocessor = new MetadataPreprocessor(contents);
    preprocessor.fix();

    const csvReader = CsvReader.createFromContents(preprocessor.getContents());

    return new MetadataContent(csvReader, thirdParties);
  }

  public async *eachItem(): AsyncGenerator<MetadataItem> {
    for await (const data of this._csvReader.records()) {
      yield new MetadataItem(
        this.changeArrayKeysFirstLetterLoweCase(this._thirdParties.addToData(data)),
      );
    }
  }

  private changeArrayKeysFirstLetterLoweCase(data: Record<string, string>): Record<string, string> {
    for (const [key, value] of Object.entries(data)) {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      data[newKey] = value;
      if (key !== newKey) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[key];
      }
    }

    return data;
  }
}

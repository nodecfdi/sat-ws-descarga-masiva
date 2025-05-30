import { MetadataItem } from '../metadata_item.js';
import { CsvReader } from './csv_reader.js';
import { MetadataPreprocessor } from './metadata_preprocessor.js';
import { ThirdPartiesRecords } from './third_parties_records.js';

export class MetadataContent {
  /**
   * The iterator will be used in a foreach loop to create MetadataItems
   * The first iteration must contain an array of header names that will be renames to lower case first letter
   * The next iterations must contain an array with data
   */
  public constructor(
    private readonly _csvReader: CsvReader,
    private readonly _thirdParties: ThirdPartiesRecords,
  ) {}

  /**
   * This method fix the content and create a SplTempFileObject to store the information
   */
  public static createFromContents(
    contents: string,
    thirdParties?: ThirdPartiesRecords,
  ): MetadataContent {
    const defaultThirdParties = thirdParties ?? ThirdPartiesRecords.createEmpty();
    // fix known errors on metadata text file
    const preprocessor = new MetadataPreprocessor(contents);
    preprocessor.fix();

    const csvReader = CsvReader.createFromContents(preprocessor.getContents());

    return new MetadataContent(csvReader, defaultThirdParties);
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

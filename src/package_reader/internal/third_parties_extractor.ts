import { type PackageReaderInterface } from '../package_reader_interface.js';
import { CsvReader } from './csv_reader.js';
import { ThirdPartiesFileFilter } from './file_filters/third_parties_file_filter.js';
import { FilteredPackageReader } from './filtered_package_reader.js';

export type ThirdPartiesInterface = {
  RfcACuentaTerceros: string;
  NombreACuentaTerceros: string;
};

/**
 * Class to extract the data from a "third parties" file.
 */
export class ThirdPartiesExtractor {
  public constructor(private readonly _csvReader: CsvReader) {}

  public static async createFromPackageReader(
    packageReader: PackageReaderInterface,
  ): Promise<ThirdPartiesExtractor> {
    if (!(packageReader instanceof FilteredPackageReader)) {
      throw new TypeError('PackageReader parameter must be a FilteredPackageReader');
    }

    const previousFilter = packageReader.changeFilter(new ThirdPartiesFileFilter());
    let contents = '';
    // eslint-disable-next-line no-unreachable-loop
    for await (const fileContents of packageReader.fileContents()) {
      for (const item of fileContents) {
        contents = item[1];
      }

      break;
    }

    packageReader.setFilter(previousFilter);

    return new ThirdPartiesExtractor(CsvReader.createFromContents(contents));
  }

  public async *eachRecord(): AsyncGenerator<Map<string, ThirdPartiesInterface>> {
    let uuid: string;
    for await (const data of this._csvReader.records()) {
      uuid = data.Uuid.toUpperCase();
      if (uuid === '') {
        continue;
      }

      const value = {
        RfcACuentaTerceros: data.RfcACuentaTerceros,
        NombreACuentaTerceros: data.NombreACuentaTerceros,
      };
      yield new Map().set(uuid, value);
    }
  }
}

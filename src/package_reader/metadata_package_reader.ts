import { MetadataFileFilter } from './internal/file_filters/metadata_file_filter.js';
import { FilteredPackageReader } from './internal/filtered_package_reader.js';
import { MetadataContent } from './internal/metadata_content.js';
import { ThirdPartiesRecords } from './internal/third_parties_records.js';
import { type MetadataItem } from './metadata_item.js';
import { type PackageReaderInterface } from './package_reader_interface.js';

export class MetadataPackageReader implements PackageReaderInterface {
  constructor(
    private readonly _packageReader: PackageReaderInterface,
    private _thirdParties?: ThirdPartiesRecords,
  ) {}

  public static async createFromFile(fileName: string): Promise<MetadataPackageReader> {
    const packageReader = await FilteredPackageReader.createFromFile(fileName);
    packageReader.setFilter(new MetadataFileFilter());

    const thirdParties = await ThirdPartiesRecords.createFromPackageReader(packageReader);

    return new MetadataPackageReader(packageReader, thirdParties);
  }

  public static async createFromContents(contents: string): Promise<MetadataPackageReader> {
    const packageReader = await FilteredPackageReader.createFromContents(contents);
    packageReader.setFilter(new MetadataFileFilter());
    // delete temporary file
    await packageReader.destruct();

    const thirdParties = await ThirdPartiesRecords.createFromPackageReader(packageReader);

    return new MetadataPackageReader(packageReader, thirdParties);
  }

  public async getThirdParties(): Promise<ThirdPartiesRecords> {
    this._thirdParties =
      this._thirdParties ??
      (await ThirdPartiesRecords.createFromPackageReader(this._packageReader));

    return this._thirdParties;
  }

  public async *metadata(): AsyncGenerator<MetadataItem> {
    let reader: MetadataContent;
    for await (const content of this._packageReader.fileContents()) {
      const parties = await this.getThirdParties();
      for await (const [, value] of content) {
        reader = MetadataContent.createFromContents(value, parties);
        for await (const item of reader.eachItem()) {
          yield item;
        }
      }
    }
  }

  public getFilename(): string {
    return this._packageReader.getFilename();
  }

  public async count(): Promise<number> {
    let count = 0;
    for await (const [,] of this.fileContents()) {
      count++;
    }

    return count;
  }

  public async *fileContents(): AsyncGenerator<Map<string, string>> {
    yield* this._packageReader.fileContents();
  }

  public async jsonSerialize(): Promise<{
    source: string;
    files: Record<string, string>;
    metadata: Record<string, Record<string, string>>;
  }> {
    const filtered = await (this._packageReader as FilteredPackageReader).jsonSerialize();

    let metadata: Record<string, Record<string, string>> = {};

    for await (const iterator of this.metadata()) {
      metadata = { ...metadata, [iterator.get('uuid')]: iterator.all() };
    }

    return {
      source: filtered.source,
      files: filtered.files,
      metadata,
    };
  }

  public async metadataToArray(): Promise<MetadataItem[]> {
    const content = [];
    for await (const iterator of this.metadata()) {
      content.push(iterator);
    }

    return content;
  }
}

import { Helpers } from '../internal/helpers';
import { MetadataFileFilter } from './internal/file-filters/metadata-file-filter';
import { FilteredPackageReader } from './internal/filtered-package-reader';
import { MetadataContent } from './internal/metadata-content';
import { ThirdPartiesRecords } from './internal/third-parties-records';
import { MetadataItem } from './metadata-item';
import { PackageReaderInterface } from './package-reader-interface';

export class MetadataPackageReader implements PackageReaderInterface {
    constructor(private _packageReader: PackageReaderInterface, private _thirdParties?: ThirdPartiesRecords) {}

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
        packageReader.destruct();

        const thirdParties = await ThirdPartiesRecords.createFromPackageReader(packageReader);

        return new MetadataPackageReader(packageReader, thirdParties);
    }

    public async getThirdParties(): Promise<ThirdPartiesRecords> {
        this._thirdParties =
            this._thirdParties ?? (await ThirdPartiesRecords.createFromPackageReader(this._packageReader));

        return this._thirdParties;
    }

    public async *metadata(): AsyncGenerator<MetadataItem> {
        let reader: MetadataContent;
        const fileContents = await Helpers.iteratorToMap(this._packageReader.fileContents());
        for (const content of fileContents.values()) {
            reader = MetadataContent.createFromContents(content, await this.getThirdParties());
            for await (const item of reader.eachItem()) {
                yield item;
            }
        }
    }

    public getFilename(): string {
        return this._packageReader.getFilename();
    }

    public async count(): Promise<number> {
        return (await Helpers.iteratorToMap(this.fileContents())).size;
    }

    public async *fileContents(): AsyncGenerator<Record<string, string>> {
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
            metadata
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

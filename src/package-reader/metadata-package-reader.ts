import { Helpers } from '../internal/helpers';
import { MetadataFileFilter } from './internal/file-filters/metadata-file-filter';
import { FilteredPackageReader } from './internal/filtered-package-reader';
import { MetadataContent } from './internal/metadata-content';
import { MetadataItem } from './metadata-item';
import { PackageReaderInterface } from './package-reader-interface';

export class MetadaPackageReader implements PackageReaderInterface {
    private _packageReader: PackageReaderInterface;

    constructor(packageReader: PackageReaderInterface) {
        this._packageReader = packageReader;
    }

    public static async createFromFile(fileName: string): Promise<MetadaPackageReader> {
        const packageReader = await FilteredPackageReader.createFromFile(fileName);
        packageReader.setFilter(new MetadataFileFilter());

        return new MetadaPackageReader(packageReader);
    }

    public static async createFromContents(contents: string): Promise<MetadaPackageReader> {
        const packageReader = await FilteredPackageReader.createFromContents(contents);
        packageReader.setFilter(new MetadataFileFilter());
        // delete temporary file
        packageReader.destruct();

        return new MetadaPackageReader(packageReader);
    }

    public async *metadata(): AsyncGenerator<Record<string, MetadataItem>> {
        let reader: MetadataContent;
        const fileContents = await Helpers.iteratorToMap(this._packageReader.fileContents());
        for (const content of fileContents.values()) {
            reader = MetadataContent.createFromContents(content);
            const items = await reader.eachItem();
            for (const item of items) {
                yield Object.fromEntries([[item.get('uuid'), item]]);
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
        for await (const iterator of this._packageReader.fileContents()) {
            yield iterator;
        }
    }

    public async jsonSerialize(): Promise<{
        source: string;
        files: Record<string, string>;
        metadata: Record<string, MetadataItem>;
    }> {
        const filtered = await (this._packageReader as FilteredPackageReader).jsonSerialize();

        return {
            source: filtered.source,
            files: filtered.files,
            metadata: await Helpers.iteratorToObject(this.metadata())
        };
    }
}

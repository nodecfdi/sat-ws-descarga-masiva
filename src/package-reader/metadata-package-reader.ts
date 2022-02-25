import { MetadataFileFilter } from "./internal/file-filters/metadata-file-filter";
import { FilteredPackageReader } from "./internal/filtered-package-reader";
import { MetadataContent } from "./internal/metadata-content";
import { MetadataItem } from "./metadata-item";
import { PackageReaderInterface } from "./package-reader-interface";

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

    public async metadata(): Promise<Map<string, MetadataItem>> {
        let reader: MetadataContent;
        const fileContents = await this._packageReader.fileContents()
        const metadata = new Map<string, MetadataItem>();
        for await (const content of fileContents.values()) {
            reader = MetadataContent.createFromContents(content);
            (await reader.eachItem()).forEach(item => {
                metadata.set(item.get('uuid'), item)
            });
        }
        return metadata;
    }

    public getFilename(): string {
        return this._packageReader.getFilename();
    }

    public async count(): Promise<number> {
        return (await this.fileContents()).size;
    }

    public fileContents(): Promise<Map<string, string>> {
        return this._packageReader.fileContents();
    }

    public async jsonSerialize(): Promise<{ source: string, files: Record<string, string>, metadata: Record<string, MetadataItem> }> {
        const filtered = await (this._packageReader as FilteredPackageReader).jsonSerialize();
        return {
            source: filtered.source,
            files: filtered.files,
            metadata: Object.fromEntries(await this.metadata())
        }
    }
}

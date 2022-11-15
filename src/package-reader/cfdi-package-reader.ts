import { Helpers } from '../internal/helpers';
import { CfdiFileFilter } from './internal/file-filters/cfdi-file-filter';
import { FilteredPackageReader } from './internal/filtered-package-reader';
import { PackageReaderInterface } from './package-reader-interface';

export class CfdiPackageReader implements PackageReaderInterface {
    constructor(private _packageReader: PackageReaderInterface) {}

    public static async createFromFile(filename: string): Promise<CfdiPackageReader> {
        const packageReader = await FilteredPackageReader.createFromFile(filename);
        packageReader.setFilter(new CfdiFileFilter());

        return new CfdiPackageReader(packageReader);
    }

    public static async createFromContents(contents: string): Promise<CfdiPackageReader> {
        const packageReader = await FilteredPackageReader.createFromContents(contents);
        packageReader.setFilter(new CfdiFileFilter());
        // delete temporary file
        packageReader.destruct();

        return new CfdiPackageReader(packageReader);
    }

    public async *cfdis(): AsyncGenerator<Record<string, string>> {
        for await (const content of this._packageReader.fileContents()) {
            const data = Object.values(content)[0];
            yield Object.fromEntries([[CfdiPackageReader.obtainUuidFromXmlCfdi(data), data]]);
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

    public static obtainUuidFromXmlCfdi(xmlContent: string): string {
        const pattern = /:Complemento.*?:TimbreFiscalDigital.*?UUID="(?<uuid>[-a-zA-Z0-9]{36})"/s;
        const found = xmlContent.match(pattern);
        if (found && found.groups && found.groups['uuid']) {
            return found.groups['uuid'].toLowerCase();
        }

        return '';
    }

    public async jsonSerialize(): Promise<{
        source: string;
        files: Record<string, string>;
        cfdis: Record<string, string>;
    }> {
        const filtered = await (this._packageReader as FilteredPackageReader).jsonSerialize();

        return {
            source: filtered.source,
            files: filtered.files,
            cfdis: await Helpers.iteratorToObject(this.cfdis())
        };
    }
}

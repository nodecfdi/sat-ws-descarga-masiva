import { Helpers } from '../internal/helpers';
import { CfdiFileFilter } from './internal/file-filters/cfdi-file-filter';
import { FilteredPackageReader } from './internal/filtered-package-reader';
import { PackageReaderInterface } from './package-reader-interface';

export class CfdiPackageReader implements PackageReaderInterface {
    private _packageReader: PackageReaderInterface;

    constructor(packageReader: PackageReaderInterface) {
        this._packageReader = packageReader;
    }

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
        const contents = this._packageReader.fileContents();
        for await (const content of contents) {
            const data = Object.values(content)[0];
            const key = CfdiPackageReader.obtainUuidFromXmlCfdi(data);
            yield Object.fromEntries([[key, data]]);
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


    public static obtainUuidFromXmlCfdi(xmlContent: string): string {
        const pattern = /:Complemento.*?:TimbreFiscalDigital.*?UUID="(?<uuid>[-a-zA-Z0-9]{36})"/s;
        const found = xmlContent.match(pattern);
        if (found && found.groups && found.groups['uuid']) {
            return found.groups['uuid'].toLowerCase();
        }
        return '';
    }

    public async jsonSerialize(): Promise<{ source: string, files: Record<string, string>, cfdis: Record<string, string> }> {
        const filtered = await (this._packageReader as FilteredPackageReader).jsonSerialize();
        return {
            source: filtered.source,
            files: filtered.files,
            cfdis: await Helpers.iteratorToObject(this.cfdis()),
        };
    }
}

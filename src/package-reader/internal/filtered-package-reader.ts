import { unlinkSync, realpathSync, readFileSync, writeFileSync } from "fs";
import JSZip from "jszip";
import { OpenZipFileException } from "../exceptions/open-zip-file-exception";
import { PackageReaderInterface } from "../package-reader-interface";
import { FileFilterInterface } from "./file-filters/file-filter-interface";
import os from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { CreateTemporaryZipFileException } from "../exceptions/create-temporary-file-zip-exception";
import { NullFileFilter } from "./file-filters/null-file-filter";
import { Helpers } from "../../internal/helpers";

export class FilteredPackageReader implements PackageReaderInterface {
    private _filename: string;
    private _archive: JSZip;
    private _removeOnDestruct = false;
    private _filter?: FileFilterInterface;

    /**
     *
     */
    constructor(filename: string, archive: JSZip) {
        this._filename = filename;
        this._archive = archive;
    }

    public destruct(): void {
        if (this._removeOnDestruct) {
            unlinkSync(this._filename);
        }
    }

    public static async createFromFile(filename: string): Promise<FilteredPackageReader> {
        let archive = new JSZip();
        let data: Buffer;
        try {
            // if is directory fails in windows, linux and mac, not fails in BSD
            data = readFileSync(filename);
        } catch (error) {
            throw OpenZipFileException.create(filename, -1);
        }
        try {
            archive = await JSZip.loadAsync(data)
        } catch (error) {
            throw OpenZipFileException.create(filename, -1);
        }
        return new FilteredPackageReader(filename, archive);
    }

    public static async createFromContents(contents: string): Promise<FilteredPackageReader> {
        const tmpdir = realpathSync(os.tmpdir());
        const tmpfile = join(tmpdir, `${randomUUID()}.zip`);
        // create temp file
        try {
            writeFileSync(tmpfile, '');
        } catch (error) {
            throw CreateTemporaryZipFileException.create('Cannot create a temporary file', error as Error);
        }
        // write contents 
        try {
            writeFileSync(tmpfile, contents, { encoding: 'binary' });
        } catch (error) {
            throw CreateTemporaryZipFileException.create('Cannot store contents on temporary file', error as Error);
        }

        let cpackage: FilteredPackageReader;
        // build object
        try {
            cpackage = await FilteredPackageReader.createFromFile(tmpfile);
        } catch (error) {
            unlinkSync(tmpfile);
            throw error;
        }
        cpackage._removeOnDestruct = true;
        return cpackage;
    }

    public async *fileContents(): AsyncGenerator<Record<string, string>> {
        const archive = this.getArchive();
        const filter = this.getFilter();
        const entries = Object.keys(archive.files).map(function (name) {
            return archive.files[name].name;
        });
        let contents: string | undefined;

        for (let index = 0; index < entries.length; index++) {
            if (!filter?.filterFilename(entries[index])) {
                continue;
            }
            contents = await archive.file(entries[index])?.async('text')
            if (contents == undefined || !filter.filterContents(contents)) {
                continue;
            }
            yield Object.fromEntries([[entries[index], contents || '']]);
        }
    }

    public async count(): Promise<number> {
        return (await Helpers.iteratorToMap(this.fileContents())).size;
    }

    public getFilename(): string {
        return this._filename;
    }

    public getArchive(): JSZip {
        return this._archive;
    }

    public getFilter(): FileFilterInterface | undefined {
        return this._filter;
    }

    public setFilter(filter?: FileFilterInterface): void {
        this._filter = filter ?? new NullFileFilter();
    }

    public async jsonSerialize(): Promise<{ source: string, files: Record<string, string> }> {
        return {
            source: this.getFilename(),
            files: await Helpers.iteratorToObject(this.fileContents()),
        }
    }
}

import { randomUUID } from 'node:crypto';
import { readFile, realpath, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import JSZip from 'jszip';
import { CreateTemporaryZipFileException } from '../exceptions/create_temporary_file_zip_exception.js';
import { OpenZipFileException } from '../exceptions/open_zip_file_exception.js';
import { type PackageReaderInterface } from '../package_reader_interface.js';
import { type FileFilterInterface } from './file_filters/file_filter_interface.js';
import { NullFileFilter } from './file_filters/null_file_filter.js';

export class FilteredPackageReader implements PackageReaderInterface {
  private readonly _filename: string;

  private readonly _archive: JSZip;

  private _removeOnDestruct = false;

  private _filter!: FileFilterInterface;

  public constructor(filename: string, archive: JSZip) {
    this._filename = filename;
    this._archive = archive;
  }

  public static async createFromFile(filename: string): Promise<FilteredPackageReader> {
    let archive: JSZip;
    let data: Buffer;
    try {
      // if is directory fails in windows, linux and mac, not fails in BSD
      data = await readFile(filename);
    } catch {
      throw OpenZipFileException.create(filename, -1);
    }

    try {
      // eslint-disable-next-line sonarjs/no-unsafe-unzip
      archive = await JSZip.loadAsync(data);
    } catch {
      throw OpenZipFileException.create(filename, -1);
    }

    return new FilteredPackageReader(filename, archive);
  }

  public static async createFromContents(contents: string): Promise<FilteredPackageReader> {
    const tmpdir = await realpath(os.tmpdir());
    const tmpfile = path.join(tmpdir, `${randomUUID()}.zip`);
    // create temp file
    try {
      await writeFile(tmpfile, '');
    } catch (error) {
      throw CreateTemporaryZipFileException.create(
        'Cannot create a temporary file',
        error as Error,
      );
    }

    // write contents
    try {
      await writeFile(tmpfile, contents, { encoding: 'binary' });
    } catch (error) {
      throw CreateTemporaryZipFileException.create(
        'Cannot store contents on temporary file',
        error as Error,
      );
    }

    let cpackage: FilteredPackageReader;
    // build object
    try {
      cpackage = await FilteredPackageReader.createFromFile(tmpfile);
    } catch (error) {
      await unlink(tmpfile);
      throw error;
    }

    cpackage._removeOnDestruct = true;

    return cpackage;
  }

  public async destruct(): Promise<void> {
    if (this._removeOnDestruct) {
      await unlink(this._filename);
    }
  }

  public async *fileContents(): AsyncGenerator<Map<string, string>> {
    const archive = this.getArchive();
    const filter = this.getFilter();
    const entries = Object.keys(archive.files).map((name) => archive.files[name].name);
    let contents: string | undefined;

    for (const entry of entries) {
      if (!filter.filterFilename(entry)) {
        continue;
      }

      contents = await archive.file(entry)?.async('text');
      if (contents === undefined || !filter.filterContents(contents)) {
        continue;
      }

      yield new Map().set(entry, contents || '');
    }
  }

  public async count(): Promise<number> {
    let count = 0;
    for await (const [,] of this.fileContents()) {
      count += 1;
    }

    return count;
  }

  public getFilename(): string {
    return this._filename;
  }

  public getArchive(): JSZip {
    return this._archive;
  }

  public getFilter(): FileFilterInterface {
    return this._filter;
  }

  public setFilter(filter?: FileFilterInterface): void {
    this._filter = filter ?? new NullFileFilter();
  }

  public changeFilter(filter: FileFilterInterface): FileFilterInterface {
    const previous = this.getFilter();
    this.setFilter(filter);

    return previous;
  }

  public async jsonSerialize(): Promise<{
    source: string;
    files: Record<string, string>;
  }> {
    let files: Record<string, string> = {};
    for await (const item of this.fileContents()) {
      for (const [key, value] of item) {
        files = { ...files, [key]: value };
      }
    }

    return {
      source: this.getFilename(),
      files,
    };
  }
}

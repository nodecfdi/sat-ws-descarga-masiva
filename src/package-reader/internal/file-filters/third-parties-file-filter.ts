import { type FileFilterInterface } from './file-filter-interface.js';
/**
 * Implementation to filter a Metadata Package file contents
 */
export class ThirdPartiesFileFilter implements FileFilterInterface {
  public filterFilename(filename: string): boolean {
    return /^[^/\\]+_tercero\.txt/i.test(filename);
  }

  public filterContents(contents: string): boolean {
    return contents.startsWith('Uuid~RfcACuentaTerceros~NombreACuentaTerceros');
  }
}

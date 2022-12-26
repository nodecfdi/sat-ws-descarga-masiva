import { FileFilterInterface } from './file-filter-interface';
/**
 * Implementation to filter a Metadata Package file contents
 */
export class ThirdPartiesFileFilter implements FileFilterInterface {
    public filterFilename(filename: string): boolean {
        return /^[^/\\]+_tercero\.txt/i.test(filename);
    }

    public filterContents(contents: string): boolean {
        return 'Uuid~RfcACuentaTerceros~NombreACuentaTerceros' == contents.substring(0, 45);
    }
}

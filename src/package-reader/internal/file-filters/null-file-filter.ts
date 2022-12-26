import { FileFilterInterface } from './file-filter-interface';
/**
 * NullObject patern, it does not filter any file contents
 */
export class NullFileFilter implements FileFilterInterface {
    public filterFilename(_filename: string): boolean {
        return true;
    }

    public filterContents(_contents: string): boolean {
        return true;
    }
}

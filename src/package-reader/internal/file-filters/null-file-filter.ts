import { FileFilterInterface } from './file-filter-interface';
/**
 * NullObject patern, it does not filter any file contents
 *
 * @internal
 */
export class NullFileFilter implements FileFilterInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public filterFilename(filename: string): boolean {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public filterContents(contents: string): boolean {
        return true;
    }
}

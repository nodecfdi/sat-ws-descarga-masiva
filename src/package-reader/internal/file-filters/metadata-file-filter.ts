import { FileFilterInterface } from './file-filter-interface';
/**
 * Implementation to filter a Metadata Package file contents
 *
 * @internal
 */
export class MetadataFileFilter implements FileFilterInterface {
    public filterFilename(filename: string): boolean {
        return /^[^/\\]+\.txt/i.test(filename);
    }

    public filterContents(contents: string): boolean {
        return 'Uuid~RfcEmisor~' == contents.substring(0, 15);
    }
}

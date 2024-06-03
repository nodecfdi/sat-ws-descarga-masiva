import { type FileFilterInterface } from './file_filter_interface.js';
/**
 * Implementation to filter a Metadata Package file contents
 *
 */
export class MetadataFileFilter implements FileFilterInterface {
  public filterFilename(filename: string): boolean {
    return /^[^/\\]+\.txt/i.test(filename);
  }

  public filterContents(contents: string): boolean {
    return contents.startsWith('Uuid~RfcEmisor~');
  }
}

/**
 * Filter by filename or content contract
 */
export type FileFilterInterface = {
  /**
   * Filter the file name
   */
  filterFilename(filename: string): boolean;

  /**
   * Filter the contents
   *
   * @param contents - Content
   * @returns boolean
   */
  filterContents(contents: string): boolean;
};

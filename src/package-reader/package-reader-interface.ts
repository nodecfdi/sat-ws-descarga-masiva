/**
 * 
 * WARNING all implementations of this interface should implements the next 2 functions:
 * 
 *  
    *  Open a file as a package
    *
    * @throws OpenZipFileException
    * @function createFromFile(filename: string): PackageReaderInterface;
    * 
    * 
    * Open the given content as a package
    * If it creates a temporary file the file must be removed automatically
    *
    * @throws CreateTemporaryZipFileException
    * @throws OpenZipFileException
    * @function createFromContents(content: string): PackageReaderInterface;
 */
export interface PackageReaderInterface {
    /**
     * Traverse each file inside the package, with the filename as key and file content as value
     */
    fileContents(): AsyncGenerator<Record<string, string>>;
    /**
     * Return the number of elements on the package
     */
    count(): Promise<number>;
    /**
     * Retrieve the currently open file name
     */
    getFilename(): string;
}


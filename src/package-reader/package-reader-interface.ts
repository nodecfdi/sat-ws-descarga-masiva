/**
 * Expected behavior of a PackageReader contract
 */
export interface PackageReaderInterface {
    /**
     * Traverse each file inside the package, with the filename as key and file content as value
     */
    fileContents(): AsyncGenerator<Map<string, string>>;
    /**
     * Return the number of elements on the package
     */
    count(): Promise<number>;
    /**
     * Retrieve the currently open file name
     */
    getFilename(): string;
}

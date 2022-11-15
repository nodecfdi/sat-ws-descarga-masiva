import { MetadataPreprocessor } from './metadata-preprocessor';
import { MetadataItem } from '../metadata-item';
import { CsvReader } from './csv-reader';
import { ThirdPartiesInterface, ThirdPartiesRecords } from './third-parties-records';

export class MetadataContent {
    /**
     * The iterator will be used in a foreach loop to create MetadataItems
     * The first iteration must contain an array of header names that will be renames to lower case first letter
     * The next iterations must contain an array with data
     */
    constructor(private _csvReader: CsvReader, private _thirdParties: ThirdPartiesRecords) {}

    /**
     * This method fix the content and create a SplTempFileObject to store the information
     */
    public static createFromContents(
        contents: string,
        thirdParties: ThirdPartiesRecords | undefined = undefined
    ): MetadataContent {
        thirdParties = thirdParties ?? ThirdPartiesRecords.createEmpty();
        // fix known errors on metadata text file
        const preprocessor = new MetadataPreprocessor(contents);
        preprocessor.fix();

        const csvReader = CsvReader.createFromContents(contents);

        return new MetadataContent(csvReader, thirdParties);
    }

    public async *eachItem(): AsyncGenerator<MetadataItem> {
        for await (const iterator of this._csvReader.records()) {
            let data = this._thirdParties.addToData(iterator);
            data = this.changeArrayKeysFirstLetterLoweCase(data) as Record<string, ThirdPartiesInterface>;
            yield new MetadataItem(data);
        }
    }

    private changeArrayKeysFirstLetterLoweCase(data: Record<string, unknown>): Record<string, unknown> {
        const keys = Object.keys(data).map((key) => key.charAt(0).toLowerCase + key.slice(1));
        const values = Object.values(data);

        return Object.fromEntries([[keys[0], values[0]]]);
    }
}

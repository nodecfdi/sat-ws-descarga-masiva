import { PackageReaderInterface } from '../package-reader-interface';
import { CsvReader } from './csv-reader';
import { ThirdPartiesFileFilter } from './file-filters/third-parties-file-filter';
import { FilteredPackageReader } from './filtered-package-reader';
import { ThirdPartiesInterface } from './third-parties-records';

/**
 * Class to extract the data from a "third parties" file.
 *
 * @internal
 */
export class ThirdPartiesExtractor {
    constructor(private _csvReader: CsvReader) {}

    public static async createFromPackageReader(packageReader: PackageReaderInterface): Promise<ThirdPartiesExtractor> {
        if (packageReader instanceof FilteredPackageReader == false) {
            throw new Error('PackageReader parameter must be a FilteredPackageReader');
        }
        const previousFilter = (packageReader as FilteredPackageReader).changeFilter(new ThirdPartiesFileFilter());
        let contents = '';

        for await (const fileContents of packageReader.fileContents()) {
            contents = Object.values(fileContents)[0];
            break;
        }
        (packageReader as FilteredPackageReader).setFilter(previousFilter);

        return new ThirdPartiesExtractor(CsvReader.createFromContents(contents));
    }

    public async *eachRecord(): AsyncGenerator<Record<string, ThirdPartiesInterface>> {
        let uuid: string;
        for await (const data of this._csvReader.records()) {
            uuid = data['Uuid']?.toUpperCase() ?? '';
            if ('' === uuid) {
                continue;
            }
            const value = {
                RfcACuentaTerceros: data['RfcACuentaTerceros'] ?? '',
                NombreACuentaTerceros: data['NombreACuentaTerceros'] ?? ''
            };
            yield Object.fromEntries([[uuid, value]]);
        }
    }
}

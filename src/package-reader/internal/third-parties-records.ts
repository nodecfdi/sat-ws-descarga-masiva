import { PackageReaderInterface } from '../package-reader-interface';
import { ThirdPartiesExtractor, ThirdPartiesInterface } from './third-parties-extractor';

export class ThirdPartiesRecords {
    constructor(private _records: Record<string, ThirdPartiesInterface>) {}

    public static createEmpty(): ThirdPartiesRecords {
        return new ThirdPartiesRecords({});
    }

    public static async createFromPackageReader(packageReader: PackageReaderInterface): Promise<ThirdPartiesRecords> {
        const thirdPartiesBuilder = await ThirdPartiesExtractor.createFromPackageReader(packageReader);
        const records: Record<string, ThirdPartiesInterface> = {};
        for await (const iterator of thirdPartiesBuilder.eachRecord()) {
            for (const [key, value] of iterator) {
                records[ThirdPartiesRecords.formatUuid(key)] = value;
            }
        }

        return new ThirdPartiesRecords(records);
    }

    private static formatUuid(uuid: string): string {
        return uuid.toLowerCase();
    }

    public addToData(data: Record<string, string>): Record<string, string> {
        const uuid = data['Uuid'] ?? '';
        const values = this.getDataFromUuid(uuid);

        return { ...data, ...values };
    }

    public getDataFromUuid(uuid: string): ThirdPartiesInterface {
        const defaultValue = {
            RfcACuentaTerceros: '',
            NombreACuentaTerceros: ''
        };

        return this._records[ThirdPartiesRecords.formatUuid(uuid)] ?? defaultValue;
    }
}

import { PackageReaderInterface } from '../package-reader-interface';
import { ThirdPartiesExtractor } from './third-parties-extractor';

interface ThirdPartiesInterface {
    RfcACuentaTerceros: string;
    NombreACuentaTerceros: string;
}

class ThirdPartiesRecords {
    private _records: Record<string, ThirdPartiesInterface>[];

    constructor(records: Record<string, ThirdPartiesInterface>[]) {
        this._records = records;
    }

    public static createEmpty(): ThirdPartiesRecords {
        return new ThirdPartiesRecords([]);
    }

    public static async createFromPackageReader(packageReader: PackageReaderInterface): Promise<ThirdPartiesRecords> {
        const thirdPartiesBuilder = await ThirdPartiesExtractor.createFromPackageReader(packageReader);
        const records = [];
        for await (const iterator of thirdPartiesBuilder.eachRecord()) {
            const key = ThirdPartiesRecords.formatUuid(Object.keys(iterator)[0]);
            records.push(Object.fromEntries([[key, Object.values(iterator)[0]]]));
        }

        return new ThirdPartiesRecords(records);
    }

    private static formatUuid(uuid: string): string {
        return uuid.toLowerCase();
    }

    public addToData(data: Record<string, string>): Record<string, ThirdPartiesInterface> {
        const uuid = Object.keys(data)[0] ?? '';
        const values = this.getDataFromUuid(uuid);

        return Object.fromEntries([[uuid, values as ThirdPartiesInterface]]);
    }

    public getDataFromUuid(uuid: string): ThirdPartiesInterface {
        const value = this._records.find((item) => Object.keys(item)[0] == ThirdPartiesRecords.formatUuid(uuid));
        const defaultValue = {
            RfcACuentaTerceros: '',
            NombreACuentaTerceros: ''
        };

        return value ? value[ThirdPartiesRecords.formatUuid(uuid)] : defaultValue;
    }
}

export { ThirdPartiesRecords };
export type { ThirdPartiesInterface };

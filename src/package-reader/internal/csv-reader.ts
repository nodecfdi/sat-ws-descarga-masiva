import { randomUUID } from 'crypto';
import { createReadStream, realpathSync, writeFileSync } from 'fs';
import { join } from 'path';
import os from 'os';
import { createInterface, Interface } from 'readline';

/**
 * Helper to iterate inside a CSV file
 * The file must have on the first line the headers.
 * The file uses "~" as separator and "|" as text delimiter.
 */
export class CsvReader {
    constructor(private _iterator: Interface) {}

    public static createIteratorFromContents(contents: string): Interface {
        const tmpdir = realpathSync(os.tmpdir());
        const filePath = join(tmpdir, `${randomUUID()}.csv`);
        writeFileSync(filePath, contents);

        const iterator = createInterface({
            input: createReadStream(filePath),
            crlfDelay: Infinity
        });

        return iterator;
    }

    public static createFromContents(contents: string): CsvReader {
        return new CsvReader(CsvReader.createIteratorFromContents(contents));
    }

    public async *records(): AsyncGenerator<Record<string, string>> {
        const headers: string[] = [];
        for await (const line of this._iterator) {
            const clean = line.split(/(?:[~|])+/g).map((item) => item.trim());

            if (clean.length == 0 || JSON.stringify(clean) === '[""]') {
                continue;
            }
            if (headers.length == 0) {
                headers.push(...clean);
                continue;
            }
            yield this.combine(headers, clean);
        }
    }

    /**
     * Like array.concat but complement missing values or missing keys (#extra-01, #extra-02, etc...)
     */
    public combine(keys: string[], values: string[]): Record<string, string> {
        const countValues = values.length;
        const countKeys = keys.length;
        if (countKeys > countValues) {
            values = values.concat(new Array(countKeys - countValues).fill(''));
        }
        if (countValues > countKeys) {
            for (let i = 1; i <= countValues - countKeys; i++) {
                const str = i.toString().padStart(2, '0');
                keys.push(`#extra-${str}`);
            }
        }
        const map = new Map();
        for (let index = 0; index < values.length; index++) {
            map.set(keys[index], values[index]);
        }

        return Object.fromEntries(map);
    }
}

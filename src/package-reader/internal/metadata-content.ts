import { MetadataPreprocessor } from './metadata-preprocessor';
import os from 'os';
import { realpathSync, writeFileSync, createReadStream } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Interface, createInterface } from 'readline';
import { MetadataItem } from '../metadata-item';
import { EventEmitter } from 'events';

export class MetadataContent {
    private _iterator: Interface;

    /**
    * The iterator will be used in a foreach loop to create MetadataItems
    * The first iteration must contain an array of header names that will be renames to lower case first letter
    * The next iterations must contain an array with data
    */
    constructor(iterator: Interface) {
        this._iterator = iterator;
    }

    public static createFromContents(contents: string): MetadataContent {
        // fix known errors on metadata text file
        const preprocessor = new MetadataPreprocessor(contents);
        preprocessor.fix();


        const tmpdir = realpathSync(os.tmpdir());
        const filePath = join(tmpdir, `${randomUUID()}.csv`);
        writeFileSync(filePath, preprocessor.getContents());

        const rl = createInterface({
            input: createReadStream(filePath),
            crlfDelay: Infinity,
        });
        return new MetadataContent(rl);
    }

    public async eachItem(): Promise<MetadataItem[]> {
        let headers: string[] = [];
        let onFirstLine = true;
        let data: string[];
        const items: MetadataItem[] = [];

        this._iterator.on('line', (line) => {
            data = line.split('~');
            if (1 == data.length) {
                return;
            }
            if (onFirstLine) {
                onFirstLine = false;
                headers = data.map((value) => value.charAt(0).toLowerCase() + value.substring(1));
                return;
            }
            items.push(this.createMetadaItem(headers, data));
        });
        await EventEmitter.once(this._iterator, 'close');
        return items;
    }

    public createMetadaItem(headers: string[], values: string[]): MetadataItem {
        const countValues = values.length;
        const countHeaders = headers.length;
        const countSub = countHeaders - countValues;

        if (countHeaders > countValues) {
            values = values.concat(new Array(countSub).fill(''));
        }
        if (countValues > countHeaders) {
            for (let index = 1; index <= countValues - countHeaders; index++) {
                headers.push(`#extra-${index.toLocaleString('en-Us', { minimumIntegerDigits: 2, useGrouping: false })}`);

            }
        }

        const map = new Map();
        for (let index = 0; index < headers.length; index++) {
            map.set(headers[index], values[index]);
        }

        return new MetadataItem(Object.fromEntries(map));
    }
}

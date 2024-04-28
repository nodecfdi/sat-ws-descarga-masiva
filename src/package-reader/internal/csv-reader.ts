import { randomUUID } from 'node:crypto';
import { createReadStream, realpathSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import * as readline from 'node:readline';

export type ReadLineInterface = {
  [Symbol.asyncIterator](): AsyncIterableIterator<string>;
};

/**
 * Helper to iterate inside a CSV file
 * The file must have on the first line the headers.
 * The file uses "~" as separator and "|" as text delimiter.
 */
export class CsvReader {
  constructor(private readonly _iterator: ReadLineInterface) {}

  public static createIteratorFromContents(contents: string): ReadLineInterface {
    const tmpdir = realpathSync(os.tmpdir());
    const filePath = join(tmpdir, `${randomUUID()}.csv`);
    writeFileSync(filePath, contents);

    const iterator = readline.createInterface({
      input: createReadStream(filePath),
      crlfDelay: Number.POSITIVE_INFINITY,
    });

    return iterator;
  }

  public static createFromContents(contents: string): CsvReader {
    return new CsvReader(CsvReader.createIteratorFromContents(contents));
  }

  public async *records(): AsyncGenerator<Record<string, string>> {
    const headers: string[] = [];
    for await (const line of this._iterator) {
      const clean = line.split(/[|~]/).map((item) => item.trim());

      if (clean.length === 0 || JSON.stringify(clean) === '[""]') {
        continue;
      }

      if (headers.length === 0) {
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
      const emptyArray: string[] = Array.from({ length: countKeys - countValues });
      values = [...values, ...emptyArray.fill('')];
    }

    if (countValues > countKeys) {
      for (let i = 1; i <= countValues - countKeys; i++) {
        const string_ = i.toString().padStart(2, '0');
        keys.push(`#extra-${string_}`);
      }
    }

    const map = new Map();
    for (const [index, value] of values.entries()) {
      map.set(keys[index], value);
    }

    return Object.fromEntries(map) as Record<string, string>;
  }
}

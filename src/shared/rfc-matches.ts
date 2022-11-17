import { RfcMatch } from './rfc-match';

export class RfcMatches {
    private _items: RfcMatch[];

    private _count: number;

    constructor(...items: RfcMatch[]) {
        this._items = items;
        this._count = items.length;
    }

    public static create(...items: RfcMatch[]): RfcMatches {
        const map = new Map<string, RfcMatch>();
        const values: RfcMatch[] = [];
        for (const item of items) {
            const key = item.getValue();
            if (!item.isEmpty() && !map.get(key)) {
                map.set(item.getValue(), item);
                values.push(item);
            }
        }

        return new RfcMatches(...values);
    }

    public static createFromValues(...values: string[]): RfcMatches {
        const valuesRfc = values.map((value) => (value === '' ? RfcMatch.empty() : RfcMatch.create(value)));

        return RfcMatches.create(...valuesRfc);
    }

    public isEmpty(): boolean {
        return 0 === this._count;
    }

    public getFirst(): RfcMatch {
        return this._items[0] ?? RfcMatch.empty();
    }

    public count(): number {
        return this._count;
    }

    public [Symbol.iterator](): Iterable<RfcMatch> {
        return this._items;
    }

    public itemsToArray(): RfcMatch[] {
        const values: RfcMatch[] = [];
        for (const iterator of this._items) {
            values.push(iterator);
        }

        return values;
    }

    public toJSON(): RfcMatch[] {
        return this._items;
    }
}

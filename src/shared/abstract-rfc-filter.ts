import { Rfc } from '@nodecfdi/rfc';

export class AbstractRfcFilter {
    protected constructor(private readonly _value?: Rfc) {}

    public static create(value: string): AbstractRfcFilter {
        try {
            return new AbstractRfcFilter(Rfc.parse(value));
        } catch {
            throw new Error('RFC is invalid');
        }
    }

    public static empty(): AbstractRfcFilter {
        return new AbstractRfcFilter();
    }

    public static check(value: string): boolean {
        try {
            AbstractRfcFilter.create(value);

            return true;
        } catch {
            return false;
        }
    }

    public isEmpty(): boolean {
        return this._value === undefined;
    }

    public getValue(): string {
        if (this._value === undefined) {
            return '';
        }

        return this._value.getRfc();
    }

    public toJSON(): string | undefined {
        return this._value?.toJSON();
    }
}

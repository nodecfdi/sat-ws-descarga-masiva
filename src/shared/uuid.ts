export class Uuid {
    constructor(private _value: string) {}

    public static create(value: string): Uuid {
        value = value.toLowerCase();
        if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/.test(value)) {
            throw new Error('UUID does not have the correct format');
        }

        return new Uuid(value);
    }

    public static empty(): Uuid {
        return new Uuid('');
    }

    public static check(value: string): boolean {
        try {
            Uuid.create(value);

            return true;
        } catch (error) {
            return false;
        }
    }

    public isEmpty(): boolean {
        return '' === this._value;
    }

    public getValue(): string {
        return this._value;
    }

    public toJSON(): string {
        return this._value;
    }
}

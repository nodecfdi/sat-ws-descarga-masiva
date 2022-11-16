export abstract class BaseEnum<T extends string> {
    constructor(public readonly _id: T) {}

    public index(): string {
        return this._id;
    }

    public abstract value(): string;

    public isTypeOf(type: T): boolean {
        return this._id === type;
    }

    public toJSON(): string {
        return this._id;
    }
}

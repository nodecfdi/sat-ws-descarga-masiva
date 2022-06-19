import { DateTime } from './date-time';

export class Token {
    private _created: DateTime;

    private _expires: DateTime;

    private _value: string;

    constructor(created: DateTime, expires: DateTime, value: string) {
        if (expires.compareTo(created) < 0) {
            throw new Error('Cannot create a token with expiration lower than creation');
        }
        this._created = created;
        this._expires = expires;
        this._value = value;
    }

    public getCreated(): DateTime {
        return this._created;
    }

    public getExpires(): DateTime {
        return this._expires;
    }

    public getValue(): string {
        return this._value;
    }

    /**
     * A token is empty if does not contains an internal value
     */
    public isValueEmpty(): boolean {
        return '' == this._value;
    }

    /**
     * A token is expired if the expiration date is greater or equal to current time
     */
    public isExpired(): boolean {
        return this._expires.compareTo(DateTime.now()) < 0;
    }

    /**
     * A token is valid if contains a value and is not expired
     */
    public isValid(): boolean {
        return !(this.isValueEmpty() || this.isExpired());
    }

    public jsonSerialize(): { created: DateTime; expires: DateTime; value: string } {
        return {
            created: this._created,
            expires: this._expires,
            value: this._value
        };
    }
}

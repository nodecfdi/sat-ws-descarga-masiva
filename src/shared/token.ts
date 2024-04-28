import { DateTime } from './date-time.js';

export class Token {
  private readonly _created: DateTime;

  constructor(
    created: DateTime,
    private readonly _expires: DateTime,
    private readonly _value: string,
  ) {
    if (_expires.compareTo(created) < 0) {
      throw new Error('Cannot create a token with expiration lower than creation');
    }

    this._created = created;
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
    return this._value === '';
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

  public toJSON(): { created: DateTime; expires: DateTime; value: string } {
    return {
      created: this._created,
      expires: this._expires,
      value: this._value,
    };
  }
}

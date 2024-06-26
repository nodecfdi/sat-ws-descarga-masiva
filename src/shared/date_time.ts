import { DateTime as DateTimeImmutable, type DurationLike } from 'luxon';
/**
 * Defines a date and time
 */
export class DateTime {
  private _value: DateTimeImmutable;

  private readonly _defaultTimeZone: string;

  /**
   * DateTime constructor.
   *
   * If value is an integer is used as a timestamp, if is a string is evaluated
   * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
   *
   * @throws Error if unable to create a DateTime
   */
  public constructor(value?: number | string | DateTimeImmutable, defaultTimeZone?: string) {
    let newValue = value ?? 'now';

    const originalValue = newValue;
    this._defaultTimeZone = defaultTimeZone ?? DateTimeImmutable.now().zone.name;
    if (typeof newValue === 'number') {
      this._value = DateTimeImmutable.fromSeconds(newValue, {
        zone: this._defaultTimeZone,
      });
      if (!this._value.isValid) {
        throw new Error(`Unable to create a Datetime("${originalValue as string}")`);
      }

      return;
    }

    if (typeof newValue === 'string') {
      newValue = this.castStringToDateTimeImmutable(newValue, originalValue as string);
    }

    if (!(newValue instanceof DateTimeImmutable) || !newValue.isValid) {
      throw new Error('Unable to create a Datetime');
    }

    this._value = newValue;
  }

  /**
   * Create a DateTime instance
   *
   * If value is an integer is used as a timestamp, if is a string is evaluated
   * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
   */
  public static create(
    value?: number | string | DateTimeImmutable,
    defaultTimeZone?: string,
  ): DateTime {
    return new DateTime(value, defaultTimeZone);
  }

  public static now(): DateTime {
    return new DateTime();
  }

  public formatSat(): string {
    return this.formatTimeZone('UTC');
  }

  public format(format: string, timezone = ''): string {
    let clonedTimeZone = timezone;
    if (clonedTimeZone === '') {
      clonedTimeZone = this._defaultTimeZone;
    }

    this._value = this._value.setZone(clonedTimeZone);

    return this._value.toFormat(format);
  }

  public formateDefaultTimeZone(): string {
    return this.formatTimeZone(this._defaultTimeZone);
  }

  public formatTimeZone(timezone: string): string {
    return this._value.setZone(timezone).toISO() ?? '';
  }

  /**
   * add or sub in given DurationLike
   *
   */
  public modify(time: DurationLike): DateTime {
    const temporary = this._value;

    return new DateTime(temporary.plus(time));
  }

  public compareTo(otherDate: DateTime): number {
    return this.formatSat().toString().localeCompare(otherDate.formatSat().toString());
  }

  public equalsTo(expectedExpires: DateTime): boolean {
    return this.formatSat() === expectedExpires.formatSat();
  }

  public toJSON(): number {
    return this._value.toSeconds();
  }

  private castStringToDateTimeImmutable(value: string, originalValue: string): DateTimeImmutable {
    if (value === 'now') {
      return DateTimeImmutable.fromISO(DateTimeImmutable.now().toISO(), {
        zone: this._defaultTimeZone,
      });
    }

    const temporary = DateTimeImmutable.fromSQL(value, {
      zone: this._defaultTimeZone,
    });
    const newValue = temporary.isValid ? temporary : DateTimeImmutable.fromISO(value);

    if (!newValue.isValid) {
      throw new Error(`Unable to create a Datetime("${originalValue}")`);
    }

    return newValue;
  }
}

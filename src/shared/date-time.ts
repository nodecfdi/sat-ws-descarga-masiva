import { DateTime as DateTimeImmutable, DurationLike } from 'luxon';
/**
 * Defines a date and time
 */
export class DateTime {
    private _value: DateTimeImmutable;

    private _defaultTimeZone: string;

    /**
     * DateTime constructor.
     *
     * If value is an integer is used as a timestamp, if is a string is evaluated
     * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
     *
     * @throws Error if unable to create a DateTime
     */
    constructor(value?: number | string | DateTimeImmutable, defaultTimeZone?: string) {
        value = value ?? 'now';

        const originalValue = value;
        this._defaultTimeZone = defaultTimeZone || DateTimeImmutable.now().zone.name;
        if (typeof value == 'number') {
            this._value = DateTimeImmutable.fromSeconds(value, { zone: this._defaultTimeZone });
            if (!this._value.isValid) {
                throw new Error(`Unable to create a Datetime("${originalValue}")`);
            }

            return;
        }
        if (typeof value == 'string') {
            if (value == 'now') {
                value = DateTimeImmutable.fromISO(DateTimeImmutable.now().toISO(), { zone: this._defaultTimeZone });
            } else {
                const temp = DateTimeImmutable.fromSQL(value, { zone: this._defaultTimeZone });
                value = temp.isValid ? temp : DateTimeImmutable.fromISO(value);
            }
            if (!value.isValid) {
                throw new Error(`Unable to create a Datetime("${originalValue}")`);
            }
        }
        if (!(value instanceof DateTimeImmutable) || !value.isValid) {
            throw new Error('Unable to create a Datetime');
        }
        this._value = value;
    }

    /**
     * Create a DateTime instance
     *
     * If value is an integer is used as a timestamp, if is a string is evaluated
     * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
     */
    public static create(value?: number | string | DateTimeImmutable, defaultTimeZone?: string): DateTime {
        return new DateTime(value, defaultTimeZone);
    }

    public static now(): DateTime {
        return new DateTime();
    }

    public formatSat(): string {
        return this.formatTimeZone('UTC');
    }

    public format(format: string, timezone = ''): string {
        if (timezone == '') {
            timezone = this._defaultTimeZone;
        }
        this._value = this._value.setZone(timezone);

        return this._value.toFormat(format);
    }

    public formateDefaultTimeZone(): string {
        return this.formatTimeZone(this._defaultTimeZone);
    }

    public formatTimeZone(timezone: string): string {
        return this._value.setZone(timezone).toISO();
    }

    /**
     * add or sub in given DurationLike
     *
     */
    public modify(time: DurationLike): DateTime {
        const temp = this._value;

        return new DateTime(temp.plus(time));
    }

    public compareTo(otherDate: DateTime): number {
        return (this.formatSat() ?? 0).toString().localeCompare((otherDate.formatSat() ?? 0).toString());
    }

    public equalsTo(expectedExpires: DateTime): boolean {
        return this.formatSat() == expectedExpires.formatSat();
    }

    public toJSON(): number {
        return this._value.toSeconds();
    }
}

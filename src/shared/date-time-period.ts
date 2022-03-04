import { DateTime } from './date-time';
/**
 * Defines a period of time by start of period and end of period values
 */
export class DateTimePeriod {
    private _start: DateTime;

    private _end: DateTime;

    constructor(start: DateTime, end: DateTime) {
        if (end.compareTo(start) < 0) {
            throw new Error('The final date must be greater than the initial date');
        }
        this._start = start;
        this._end = end;
    }

    public static create(start: DateTime, end: DateTime): DateTimePeriod {
        return new DateTimePeriod(start, end);
    }

    public static createFromValues(start: string, end: string): DateTimePeriod {
        return new DateTimePeriod(new DateTime(start), new DateTime(end));
    }

    public getStart(): DateTime {
        return this._start;
    }

    public getEnd(): DateTime {
        return this._end;
    }

    public jsonSerialize(): { start: number, end: number } {
        return {
            start: this._start.jsonSerialize(),
            end: this._end.jsonSerialize()
        };
    }
}

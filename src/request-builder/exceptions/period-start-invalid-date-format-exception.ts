import { RequestBuilderException } from '../request-builder-exception';

export class PeriodStartInvalidDateFormatException extends RequestBuilderException {
    private _periodStart: string;

    constructor(periodStart: string) {
        super(`The start date time "${periodStart}" does not have the correct format`);
        this._periodStart = periodStart;
    }

    public getPeriodStart(): string {
        return this._periodStart;
    }
}

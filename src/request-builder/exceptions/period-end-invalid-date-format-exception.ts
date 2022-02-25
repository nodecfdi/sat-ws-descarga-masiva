import { RequestBuilderException } from '../request-builder-exception';

export class PeriodEndInvalidDateFormatException extends RequestBuilderException {

    private _periodEnd: string;

    constructor(periodEnd: string) {
        super(`The end date time "${periodEnd}" does not have the correct format`);
        this._periodEnd = periodEnd;
    }

    public getPeriodEnd(): string {
        return this._periodEnd;
    }
}

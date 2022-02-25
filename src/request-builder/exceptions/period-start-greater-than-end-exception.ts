import { RequestBuilderException } from '../request-builder-exception';

export class PeriodStartGreaterThanEndException extends RequestBuilderException {

    private _periodStart: string;
    private _periodEnd: string;

    constructor(periodStart: string, periodEnd: string) {
        super(`The period start "${periodStart}" is greater than end "${periodEnd}"`);
        this._periodStart = periodStart;
        this._periodEnd = periodEnd;
    }

    public getPeriodStart(): string {
        return this._periodStart;
    }

    public getPeriodEnd(): string {
        return this._periodEnd;
    }
}

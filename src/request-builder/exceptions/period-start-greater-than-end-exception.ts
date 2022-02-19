import { RequestBuilderException } from "../request-builder-exception";

export class PeriodStartGreaterThanEndException extends RequestBuilderException {

    private periodStart: string;
    private periodEnd: string;

    constructor(periodStart: string, periodEnd: string) {
        super(`The period start "${periodStart}" is greater than end "${periodEnd}"`);
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
    }

    public getPeriodStart(): string {
        return this.periodStart;
    }

    public getPeriodEnd(): string {
        return this.periodEnd;
    }
}

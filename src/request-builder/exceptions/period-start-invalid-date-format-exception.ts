import { RequestBuilderException } from "../request-builder-exception";

export class PeriodStartInvalidDateFormatException extends RequestBuilderException {

    private periodStart: string;

    constructor(periodStart: string) {
        super(`The start date time "${periodStart}" does not have the correct format`);
        this.periodStart = periodStart;
    }

    public getPeriodStart(): string {
        return this.periodStart;
    }
}

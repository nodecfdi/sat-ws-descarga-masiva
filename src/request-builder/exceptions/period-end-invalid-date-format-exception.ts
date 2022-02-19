import { RequestBuilderException } from "../request-builder-exception";

export class PeriodEndInvalidDateFormatException extends RequestBuilderException {

    private periodEnd: string;

    constructor(periodEnd: string) {
        super(`The end date time "${periodEnd}" does not have the correct format`);
        this.periodEnd = periodEnd;
    }

    public getPeriodEnd(): string {
        return this.periodEnd;
    }
}

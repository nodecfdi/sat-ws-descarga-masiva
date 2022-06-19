import { DateTimePeriod } from '../../shared/date-time-period';
import { DownloadType } from '../../shared/download-type';
import { RequestType } from '../../shared/request-type';
/**
 * This class contains all the information required to perform a query on the SAT Web Service
 */
export class QueryParameters {
    private _period: DateTimePeriod;

    private _downloadType: DownloadType;

    private _requestType: RequestType;

    private _rfcMatch: string;

    constructor(period: DateTimePeriod, downloadType: DownloadType, requestType: RequestType, rfcMatch: string) {
        this._period = period;
        this._downloadType = downloadType;
        this._requestType = requestType;
        this._rfcMatch = rfcMatch;
    }

    public static create(
        period: DateTimePeriod,
        downloadType?: DownloadType,
        requestType?: RequestType,
        rfcMatch = ''
    ): QueryParameters {
        downloadType = downloadType || DownloadType.issued;
        requestType = requestType || RequestType.metadata;

        return new QueryParameters(period, downloadType, requestType, rfcMatch);
    }

    public getPeriod(): DateTimePeriod {
        return this._period;
    }

    public getDownloadType(): DownloadType {
        return this._downloadType;
    }

    public getRequestType(): RequestType {
        return this._requestType;
    }

    public getRfcMatch(): string {
        return this._rfcMatch;
    }

    public jsonSerialize(): {
        period: { start: number; end: number };
        downloadType: DownloadType;
        requestType: RequestType;
        rfcMatch: string;
    } {
        return {
            period: this._period.jsonSerialize(),
            downloadType: this._downloadType,
            requestType: this._requestType,
            rfcMatch: this._rfcMatch
        };
    }
}

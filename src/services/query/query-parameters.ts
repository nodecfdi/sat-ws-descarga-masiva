import { ComplementoInterface } from '~/shared/complemento-interface';
import { ComplementoUndefined } from '~/shared/complemento-undefined';
import { DateTime } from '~/shared/date-time';
import { DocumentStatus } from '~/shared/document-status';
import { DocumentType } from '~/shared/document-type';
import { RfcMatch } from '~/shared/rfc-match';
import { RfcMatches } from '~/shared/rfc-matches';
import { RfcOnBehalf } from '~/shared/rfc-on-behalf';
import { ServiceType } from '~/shared/service-type';
import { Uuid } from '~/shared/uuid';
import { DateTimePeriod } from '~/shared/date-time-period';
import { DownloadType } from '~/shared/download-type';
import { RequestType } from '~/shared/request-type';

type Properties =
    | '_serviceType'
    | '_period'
    | '_downloadType'
    | '_requestType'
    | '_documentType'
    | '_complement'
    | '_documentStatus'
    | '_uuid'
    | '_rfcOnBehalf'
    | '_rfcMatches'
    | '_rfcMatches';

type Values =
    | DateTimePeriod
    | ServiceType
    | DownloadType
    | RequestType
    | DocumentType
    | ComplementoInterface
    | DocumentStatus
    | Uuid
    | RfcOnBehalf
    | RfcMatches;
/**
 * This class contains all the information required to perform a query on the SAT Web Service
 */
export class QueryParameters {
    private _serviceType?: ServiceType;

    constructor(
        private _period: DateTimePeriod,
        private _downloadType: DownloadType,
        private _requestType: RequestType,
        private _documentType: DocumentType,
        private _complement: ComplementoInterface,
        private _documentStatus: DocumentStatus,
        private _uuid: Uuid,
        private _rfcOnBehalf: RfcOnBehalf,
        private _rfcMatches: RfcMatches
    ) {}

    public static create(
        period?: DateTimePeriod,
        downloadType?: DownloadType,
        requestType?: RequestType
    ): QueryParameters {
        downloadType = downloadType || new DownloadType('issued');
        requestType = requestType || new RequestType('metadata');
        const currentTime = DateTime.now().formatSat();

        return new QueryParameters(
            period ?? DateTimePeriod.createFromValues(currentTime, currentTime),
            downloadType ?? new DownloadType('issued'),
            requestType ?? new RequestType('metadata'),
            new DocumentType('undefined'),
            new ComplementoUndefined('undefined'),
            new DocumentStatus('undefined'),
            Uuid.empty(),
            RfcOnBehalf.empty(),
            RfcMatches.create()
        );
    }

    public hasServiceType(): boolean {
        return undefined !== this._serviceType;
    }

    public getServiceType(): ServiceType {
        if (undefined === this._serviceType) {
            throw new Error('Service type has not been set');
        }

        return this._serviceType;
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

    public getDocumentType(): DocumentType {
        return this._documentType;
    }

    public getComplement(): ComplementoInterface {
        return this._complement;
    }

    public getDocumentStatus(): DocumentStatus {
        return this._documentStatus;
    }

    public getUuid(): Uuid {
        return this._uuid;
    }

    public getRfcOnBehalf(): RfcOnBehalf {
        return this._rfcOnBehalf;
    }

    public getRfcMatches(): RfcMatches {
        return this._rfcMatches;
    }

    public getRfcMatch(): RfcMatch {
        return this._rfcMatches.getFirst();
    }

    public withServiceType(serviceType: ServiceType): QueryParameters {
        return this.with('_serviceType', serviceType);
    }

    public withPeriod(period: DateTimePeriod): QueryParameters {
        return this.with('_period', period);
    }

    public withDownloadType(downloadType: DownloadType): QueryParameters {
        return this.with('_downloadType', downloadType);
    }

    public withRequestType(requestType: RequestType): QueryParameters {
        return this.with('_requestType', requestType);
    }

    public withDocumentType(documentType: DocumentType): QueryParameters {
        return this.with('_documentType', documentType);
    }

    public withComplement(complement: ComplementoInterface): QueryParameters {
        return this.with('_complement', complement);
    }

    public withDocumentStatus(documentStatus: DocumentStatus): QueryParameters {
        return this.with('_documentStatus', documentStatus);
    }

    public withUuid(uuid: Uuid): QueryParameters {
        return this.with('_uuid', uuid);
    }

    public withRfcOnBehalf(rfcOnBehalf: RfcOnBehalf): QueryParameters {
        return this.with('_rfcOnBehalf', rfcOnBehalf);
    }

    public withRfcMatches(rfcMatches: RfcMatches): QueryParameters {
        return this.with('_rfcMatches', rfcMatches);
    }

    public withRfcMatch(rfcMatch: RfcMatch): QueryParameters {
        return this.with('_rfcMatches', RfcMatches.create(rfcMatch));
    }

    private with(property: Properties, value: Values): QueryParameters {
        const clone = { ...this, [property]: value };

        return clone;
    }

    public toJSON(): {
        serviceType: ServiceType | undefined;
        period: DateTimePeriod;
        downloadType: DownloadType;
        requestType: RequestType;
        documentType: DocumentType;
        complement: ComplementoInterface;
        documentStatus: DocumentStatus;
        uuid: Uuid;
        rfcOnBehalf: RfcOnBehalf;
        rfcMatches: RfcMatches;
    } {
        return {
            serviceType: this._serviceType,
            period: this._period,
            downloadType: this._downloadType,
            requestType: this._requestType,
            documentType: this._documentType,
            complement: this._complement,
            documentStatus: this._documentStatus,
            uuid: this._uuid,
            rfcOnBehalf: this._rfcOnBehalf,
            rfcMatches: this._rfcMatches
        };
    }
}

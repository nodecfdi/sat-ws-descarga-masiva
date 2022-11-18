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
import { ComplementoCfdiTypes } from '~/shared/complemento-cfdi';
import { ComplementoRetencionesTypes } from '~/shared/complemento-retenciones';

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
        private _complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>,
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

    public getComplement(): ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes> {
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
        this._serviceType = serviceType;

        return this;
    }

    public withPeriod(period: DateTimePeriod): QueryParameters {
        this._period = period;

        return this;
    }

    public withDownloadType(downloadType: DownloadType): QueryParameters {
        this._downloadType = downloadType;

        return this;
    }

    public withRequestType(requestType: RequestType): QueryParameters {
        this._requestType = requestType;

        return this;
    }

    public withDocumentType(documentType: DocumentType): QueryParameters {
        this._documentType = documentType;

        return this;
    }

    public withComplement(
        complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>
    ): QueryParameters {
        this._complement = complement;

        return this;
    }

    public withDocumentStatus(documentStatus: DocumentStatus): QueryParameters {
        this._documentStatus = documentStatus;

        return this;
    }

    public withUuid(uuid: Uuid): QueryParameters {
        this._uuid = uuid;

        return this;
    }

    public withRfcOnBehalf(rfcOnBehalf: RfcOnBehalf): QueryParameters {
        this._rfcOnBehalf = rfcOnBehalf;

        return this;
    }

    public withRfcMatches(rfcMatches: RfcMatches): QueryParameters {
        this._rfcMatches = rfcMatches;

        return this;
    }

    public withRfcMatch(rfcMatch: RfcMatch): QueryParameters {
        this._rfcMatches = RfcMatches.create(rfcMatch);

        return this;
    }

    public toJSON(): {
        serviceType: ServiceType | undefined;
        period: DateTimePeriod;
        downloadType: DownloadType;
        requestType: RequestType;
        documentType: DocumentType;
        complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>;
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

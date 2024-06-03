import { type ComplementoCfdiTypes } from '../../shared/complemento_cfdi.js';
import { type ComplementoInterface } from '../../shared/complemento_interface.js';
import { type ComplementoRetencionesTypes } from '../../shared/complemento_retenciones.js';
import { ComplementoUndefined } from '../../shared/complemento_undefined.js';
import { DateTime } from '../../shared/date_time.js';
import { DateTimePeriod } from '../../shared/date_time_period.js';
import { DocumentStatus } from '../../shared/document_status.js';
import { DocumentType } from '../../shared/document_type.js';
import { DownloadType } from '../../shared/download_type.js';
import { RequestType } from '../../shared/request_type.js';
import { type RfcMatch } from '../../shared/rfc_match.js';
import { RfcMatches } from '../../shared/rfc_matches.js';
import { RfcOnBehalf } from '../../shared/rfc_on_behalf.js';
import { type ServiceType } from '../../shared/service_type.js';
import { Uuid } from '../../shared/uuid.js';

/**
 * This class contains all the information required to perform a query on the SAT Web Service
 */
export class QueryParameters {
  private _serviceType?: ServiceType;

  public constructor(
    private _period: DateTimePeriod,
    private _downloadType: DownloadType,
    private _requestType: RequestType,
    private _documentType: DocumentType,
    private _complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>,
    private _documentStatus: DocumentStatus,
    private _uuid: Uuid,
    private _rfcOnBehalf: RfcOnBehalf,
    private _rfcMatches: RfcMatches,
  ) {}

  public static create(
    period?: DateTimePeriod,
    downloadType?: DownloadType,
    requestType?: RequestType,
  ): QueryParameters {
    const defaultDownloadType = downloadType ?? new DownloadType('issued');
    const defaultRequestType = requestType ?? new RequestType('metadata');
    const currentTime = DateTime.now().formatSat();

    return new QueryParameters(
      period ?? DateTimePeriod.createFromValues(currentTime, currentTime),
      defaultDownloadType,
      defaultRequestType,
      new DocumentType('undefined'),
      new ComplementoUndefined('undefined'),
      new DocumentStatus('undefined'),
      Uuid.empty(),
      RfcOnBehalf.empty(),
      RfcMatches.create(),
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

  public withServiceType(serviceType: ServiceType): this {
    this._serviceType = serviceType;

    return this;
  }

  public withPeriod(period: DateTimePeriod): this {
    this._period = period;

    return this;
  }

  public withDownloadType(downloadType: DownloadType): this {
    this._downloadType = downloadType;

    return this;
  }

  public withRequestType(requestType: RequestType): this {
    this._requestType = requestType;

    return this;
  }

  public withDocumentType(documentType: DocumentType): this {
    this._documentType = documentType;

    return this;
  }

  public withComplement(
    complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>,
  ): this {
    this._complement = complement;

    return this;
  }

  public withDocumentStatus(documentStatus: DocumentStatus): this {
    this._documentStatus = documentStatus;

    return this;
  }

  public withUuid(uuid: Uuid): this {
    this._uuid = uuid;

    return this;
  }

  public withRfcOnBehalf(rfcOnBehalf: RfcOnBehalf): this {
    this._rfcOnBehalf = rfcOnBehalf;

    return this;
  }

  public withRfcMatches(rfcMatches: RfcMatches): this {
    this._rfcMatches = rfcMatches;

    return this;
  }

  public withRfcMatch(rfcMatch: RfcMatch): this {
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
      rfcMatches: this._rfcMatches,
    };
  }
}

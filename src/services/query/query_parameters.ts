import { type ComplementoCfdiTypes } from '#src/shared/complemento_cfdi';
import { type ComplementoInterface } from '#src/shared/complemento_interface';
import { type ComplementoRetencionesTypes } from '#src/shared/complemento_retenciones';
import { ComplementoUndefined } from '#src/shared/complemento_undefined';
import { DateTime } from '#src/shared/date_time';
import { DateTimePeriod } from '#src/shared/date_time_period';
import { DocumentStatus } from '#src/shared/document_status';
import { DocumentType } from '#src/shared/document_type';
import { DownloadType } from '#src/shared/download_type';
import { RequestType } from '#src/shared/request_type';
import { type RfcMatch } from '#src/shared/rfc_match';
import { RfcMatches } from '#src/shared/rfc_matches';
import { RfcOnBehalf } from '#src/shared/rfc_on_behalf';
import { ServiceType } from '#src/shared/service_type';
import { Uuid } from '#src/shared/uuid';
import { QueryValidator } from './query_validator.js';

/**
 * This class contains all the information required to perform a query on the SAT Web Service
 */
export class QueryParameters {
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
    private _serviceType: ServiceType,
  ) {}

  public static create(
    period?: DateTimePeriod,
    downloadType?: DownloadType,
    requestType?: RequestType,
    serviceType?: ServiceType,
  ): QueryParameters {
    const defaultDownloadType = downloadType ?? new DownloadType('issued');
    const defaultRequestType = requestType ?? new RequestType('metadata');
    const currentDateTime = DateTime.now();
    const currentTime = currentDateTime.formatSat();
    const currentTimeplusOne = currentDateTime.modify({ seconds: 1 }).formatSat();

    return new QueryParameters(
      period ?? DateTimePeriod.createFromValues(currentTime, currentTimeplusOne),
      defaultDownloadType,
      defaultRequestType,
      new DocumentType('undefined'),
      new ComplementoUndefined('undefined'),
      new DocumentStatus('undefined'),
      Uuid.empty(),
      RfcOnBehalf.empty(),
      RfcMatches.create(),
      serviceType ?? new ServiceType('cfdi'),
    );
  }

  public getServiceType(): ServiceType {
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

  public validate(): string[] {
    return new QueryValidator().validate(this);
  }

  public toJSON(): {
    serviceType: ServiceType;
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

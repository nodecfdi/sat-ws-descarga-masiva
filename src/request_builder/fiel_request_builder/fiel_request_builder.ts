import { createHash, randomUUID } from 'node:crypto';
import { Helpers } from '#src/internal/helpers';
import { type Fiel } from '#src/request_builder/fiel_request_builder/fiel';
import { type RequestBuilderInterface } from '#src/request_builder/request_builder_interface';
import { type QueryParameters } from '#src/services/query/query_parameters';
import { type DateTime } from '#src/shared/date_time';
import { RfcMatches } from '#src/shared/rfc_matches';

export class FielRequestBuilder implements RequestBuilderInterface {
  public constructor(private readonly _fiel: Fiel) {}

  public getFiel(): Fiel {
    return this._fiel;
  }

  public authorization(created: DateTime, expires: DateTime, securityTokenId = ''): string {
    const uuid = securityTokenId || FielRequestBuilder.createXmlSecurityToken();
    const certificate = Helpers.cleanPemContents(this.getFiel().getCertificatePemContents());

    const keyInfoData = `
            <KeyInfo>
                <o:SecurityTokenReference>
                    <o:Reference URI="#${uuid}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
                </o:SecurityTokenReference>
            </KeyInfo>
        `;
    const toDigestXml = `
            <u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0">
                <u:Created>${created.formatSat()}</u:Created>
                <u:Expires>${expires.formatSat()}</u:Expires>
            </u:Timestamp>
        `;
    const signatureData = this.createSignature(toDigestXml, '#_0', keyInfoData);

    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                <s:Header>
                    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1">
                        <u:Timestamp u:Id="_0">
                            <u:Created>${created.formatSat()}</u:Created>
                            <u:Expires>${expires.formatSat()}</u:Expires>
                        </u:Timestamp>
                        <o:BinarySecurityToken u:Id="${uuid}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
                            ${certificate}
                        </o:BinarySecurityToken>
                        ${signatureData}
                    </o:Security>
                </s:Header>
                <s:Body>
                    <Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/>
                </s:Body>
            </s:Envelope>
        `;

    return Helpers.nospaces(xml);
  }

  public query(queryParameters: QueryParameters): string {
    if (!queryParameters.getUuid().isEmpty()) {
      return this.queryFolio(queryParameters);
    }

    return this.queryIssuedReceived(queryParameters);
  }

  private queryFolio(queryParameters: QueryParameters): string {
    const rfcSigner = this.getFiel().getRfc().toUpperCase();
    const attributes = new Map<string, string>();
    attributes.set('RfcSolicitante', rfcSigner);
    attributes.set('Folio', queryParameters.getUuid().getValue());

    return this.buildFinalXml('SolicitaDescargaFolio', attributes, '');
  }

  private queryIssuedReceived(queryParameters: QueryParameters): string {
    let xmlRfcReceived = '';
    const requestType = queryParameters.getRequestType().getQueryAttributeValue();
    const rfcSigner = this.getFiel().getRfc().toUpperCase();
    const start = queryParameters.getPeriod().getStart().format("yyyy-MM-dd'T'HH:mm:ss");
    const end = queryParameters.getPeriod().getEnd().format("yyyy-MM-dd'T'HH:mm:ss");
    let rfcIssuer: string;
    let rfcReceivers: RfcMatches;
    if (queryParameters.getDownloadType().isTypeOf('issued')) {
      // issued documents, counterparts are receivers
      rfcIssuer = rfcSigner;
      rfcReceivers = queryParameters.getRfcMatches();
    } else {
      // received documents, counterpart is issuer
      rfcIssuer = queryParameters.getRfcMatches().getFirst().getValue();
      rfcReceivers = RfcMatches.create();
    }
    const attributes = new Map<string, string>();
    attributes.set('RfcSolicitante', rfcSigner);
    attributes.set('TipoSolicitud', requestType);
    attributes.set('FechaInicial', start);
    attributes.set('FechaFinal', end);
    attributes.set('RfcEmisor', rfcIssuer);
    attributes.set('TipoComprobante', queryParameters.getDocumentType().value());
    attributes.set(
      'EstadoComprobante',
      queryParameters.getDocumentStatus().getQueryAttributeValue(),
    );
    attributes.set('RfcACuentaTerceros', queryParameters.getRfcOnBehalf().getValue());
    attributes.set('Complemento', queryParameters.getComplement().value());
    if (queryParameters.getDownloadType().isTypeOf('received')) {
      attributes.set('RfcReceptor', rfcSigner);
    }
    if (!rfcReceivers.isEmpty()) {
      xmlRfcReceived = rfcReceivers
        .itemsToArray()
        .map(
          (rfcMatch) => `<des:RfcReceptor>${this.parseXml(rfcMatch.getValue())}</des:RfcReceptor>`,
        )
        .join('');
      xmlRfcReceived = `<des:RfcReceptores>${xmlRfcReceived}</des:RfcReceptores>`;
    }
    const nodeName = queryParameters.getDownloadType().isTypeOf('issued')
      ? 'SolicitaDescargaEmitidos'
      : 'SolicitaDescargaRecibidos';

    return this.buildFinalXml(nodeName, attributes, xmlRfcReceived);
  }

  public verify(requestId: string): string {
    const xmlRequestId = this.parseXml(requestId);
    const xmlRfc = this.parseXml(this.getFiel().getRfc());

    const toDigestXml = `
            <des:VerificaSolicitudDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud IdSolicitud="${xmlRequestId}" RfcSolicitante="${xmlRfc}"></des:solicitud>
            </des:VerificaSolicitudDescarga>
        `;
    const signatureData = this.createSignature(toDigestXml);

    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:VerificaSolicitudDescarga>
                        <des:solicitud IdSolicitud="${xmlRequestId}" RfcSolicitante="${xmlRfc}">
                            ${signatureData}
                        </des:solicitud>
                    </des:VerificaSolicitudDescarga>
                </s:Body>
            </s:Envelope>
        `;

    return Helpers.nospaces(xml);
  }

  public download(packageId: string): string {
    const xmlPackageId = this.parseXml(packageId);
    const xmlRfcOwner = this.parseXml(this.getFiel().getRfc());

    const toDigestXml = `
            <des:PeticionDescargaMasivaTercerosEntrada xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:peticionDescarga IdPaquete="${xmlPackageId}" RfcSolicitante="${xmlRfcOwner}"></des:peticionDescarga>
            </des:PeticionDescargaMasivaTercerosEntrada>
        `;
    const signatureData = this.createSignature(toDigestXml);

    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:PeticionDescargaMasivaTercerosEntrada>
                        <des:peticionDescarga IdPaquete="${xmlPackageId}" RfcSolicitante="${xmlRfcOwner}">
                            ${signatureData}
                        </des:peticionDescarga>
                    </des:PeticionDescargaMasivaTercerosEntrada>
                </s:Body>
            </s:Envelope>
        `;

    return Helpers.nospaces(xml);
  }

  private buildFinalXml(
    nodeName: string,
    attributes: Map<string, string>,
    xmlExtra: string,
  ): string {
    const cleanedSolicitudAttributes = new Map();
    for (const [key, value] of attributes) {
      if (value !== '') {
        cleanedSolicitudAttributes.set(key, value);
      }
    }
    const sortedValues = new Map(
      [...cleanedSolicitudAttributes].sort((a, b) => String(a[0]).localeCompare(b[0] as string)),
    );

    const solicitudAttributesAsText = [...sortedValues]
      .map(
        ([name, value]) => `${this.parseXml(name as string)}="${this.parseXml(value as string)}"`,
      )
      .join(' ');

    const toDigestXml = `
            <des:${nodeName} xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud ${solicitudAttributesAsText}>
                    ${xmlExtra}
                </des:solicitud>
            </des:${nodeName}>
           `;
    const signatureData = this.createSignature(toDigestXml);
    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:${nodeName}>
                        <des:solicitud ${solicitudAttributesAsText}>
                            ${xmlExtra}
                            ${signatureData}
                        </des:solicitud>
                    </des:${nodeName}>
                </s:Body>
            </s:Envelope>
        `;

    return Helpers.nospaces(xml);
  }

  private createSignature(toDigest: string, signedInfoUri = '', keyInfo = ''): string {
    const cleanToDigest = Helpers.nospaces(toDigest);
    // eslint-disable-next-line sonarjs/hashing
    const digested = createHash('sha1').update(cleanToDigest).digest('base64');
    let signedInfo = this.createSignedInfoCanonicalExclusive(digested, signedInfoUri);
    const signatureValue = Buffer.from(this.getFiel().sign(signedInfo, 'sha1'), 'binary').toString(
      'base64',
    );
    signedInfo = signedInfo.replace(
      '<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">',
      '<SignedInfo>',
    );
    let newKeyInfo = keyInfo;
    if (newKeyInfo === '') {
      newKeyInfo = this.createKeyInfoData();
    }

    return `
            <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
                ${signedInfo}
                <SignatureValue>${signatureValue}</SignatureValue>
                ${newKeyInfo}
            </Signature>
        `;
  }

  private createSignedInfoCanonicalExclusive(digested: string, uri = ''): string {
    // see https://www.w3.org/TR/xmlsec-algorithms/ to understand the algorithm
    // http://www.w3.org/2001/10/xml-exc-c14n# - Exclusive Canonicalization XML 1.0 (omit comments)
    const xml = `
            <SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
                <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod>
                <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod>
                <Reference URI="${uri}">
                    <Transforms>
                        <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform>
                    </Transforms>
                    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod>
                    <DigestValue>${digested}</DigestValue>
                </Reference>
            </SignedInfo>
        `;

    return Helpers.nospaces(xml);
  }

  private createKeyInfoData(): string {
    const fiel = this.getFiel();
    const certificate = Helpers.cleanPemContents(fiel.getCertificatePemContents());
    const serial = fiel.getCertificateSerial();
    const issuerName = this.parseXml(fiel.getCertificateIssuerName());

    return `
            <KeyInfo>
                <X509Data>
                    <X509IssuerSerial>
                        <X509IssuerName>${issuerName}</X509IssuerName>
                        <X509SerialNumber>${serial}</X509SerialNumber>
                    </X509IssuerSerial>
                    <X509Certificate>${certificate}</X509Certificate>
                </X509Data>
            </KeyInfo>
        `;
  }

  private parseXml(text: string): string {
    return Helpers.htmlspecialchars(text);
  }

  private static createXmlSecurityToken(): string {
    // eslint-disable-next-line sonarjs/hashing
    const md5 = createHash('md5').update(randomUUID()).digest('hex');

    return `uuid-${md5.slice(0, 8)}-${md5.slice(4, 8)}-${md5.slice(4, 12)}-${md5.slice(4, 16)}-${md5.slice(20)}-1`;
  }
}

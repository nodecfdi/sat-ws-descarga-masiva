import { RequestBuilderInterface } from '../request-builder-interface';
import { Fiel } from './fiel';
import { Helpers } from '../../internal/helpers';
import { SignatureAlgorithm } from '@nodecfdi/credentials';
import { hextob64 } from 'jsrsasign';
import { createHash, randomUUID } from 'crypto';
import { DateTime } from '~/shared/date-time';
import { QueryParameters } from '~/services/query/query-parameters';
import { RfcMatches } from '~/shared/rfc-matches';

export class FielRequestBuilder implements RequestBuilderInterface {
    constructor(private _fiel: Fiel) {}

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
        const queryByUuid = !queryParameters.getUuid().isEmpty();
        let xmlRfcReceived = '';
        const requestType = queryParameters.getRequestType().getQueryAttributeValue(queryParameters.getServiceType());
        const rfcSigner = this.getFiel().getRfc().toUpperCase();

        const solicitudAttributes = new Map<string, string>();
        solicitudAttributes.set('RfcSolicitante', rfcSigner);
        solicitudAttributes.set('TipoSolicitud', requestType);

        if (queryByUuid) {
            solicitudAttributes.set('Folio', queryParameters.getUuid().getValue());
        } else {
            const start = queryParameters.getPeriod().getStart().format('Y-m-dTH:i:s');
            const end = queryParameters.getPeriod().getEnd().format('Y-m-dTH:i:s');
            let rfcIssuer: string;
            let rfcReceivers: RfcMatches;
            if (queryParameters.getDownloadType().isTypeOf('issued')) {
                // issued documents, counterparts are receivers
                rfcIssuer = rfcSigner;
                rfcReceivers = queryParameters.getRfcMatches();
            } else {
                // received documents, counterpart is issuer
                rfcIssuer = queryParameters.getRfcMatches().getFirst().getValue();
                rfcReceivers = RfcMatches.createFromValues(rfcSigner);
            }
            solicitudAttributes.set('FechaInicial', start);
            solicitudAttributes.set('FechaFinal', end);
            solicitudAttributes.set('RfcEmisor', rfcIssuer);
            solicitudAttributes.set('TipoComprobante', queryParameters.getDocumentType().value());
            solicitudAttributes.set('EstadoComprobante', queryParameters.getDocumentStatus().value());
            solicitudAttributes.set('RfcACuentaTerceros', queryParameters.getRfcOnBehalf().getValue());
            solicitudAttributes.set('Complemento', queryParameters.getComplement().value());
            if (!rfcReceivers.isEmpty()) {
                xmlRfcReceived = rfcReceivers
                    .itemsToArray()
                    .map((rfcMatch) => {
                        return `<des:RfcReceptor>${this.parseXml(rfcMatch.getValue())}</des:RfcReceptor>`;
                    })
                    .join('');
            }
        }
        const cleanedSolicitudAttributes = new Map();
        for (const [key, value] of solicitudAttributes) {
            if (value !== '') cleanedSolicitudAttributes.set(key, value);
        }
        const sortedValues = new Map([...cleanedSolicitudAttributes].sort((a, b) => String(a[0]).localeCompare(b[0])));

        const solicitudAttributesAsText = [...sortedValues]
            .map(([name, value]) => {
                return `${this.parseXml(name)}="${this.parseXml(value)}"`;
            })
            .join(' ');

        const toDigestXml = `
            <des:SolicitaDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud ${solicitudAttributesAsText}>
                    ${xmlRfcReceived}
                </des:solicitud>
            </des:SolicitaDescarga>
           `;
        const signatureData = this.createSignature(toDigestXml);
        const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:SolicitaDescarga>
                        <des:solicitud ${solicitudAttributesAsText}>
                            ${xmlRfcReceived}
                            ${signatureData}
                        </des:solicitud>
                    </des:SolicitaDescarga>
                </s:Body>
            </s:Envelope>
        `;

        return Helpers.nospaces(xml);
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
                        <des:solicitud IdSolicitud="${requestId}" RfcSolicitante="${xmlRfc}">
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

    private static createXmlSecurityToken(): string {
        const md5 = createHash('md5').update(randomUUID()).digest('hex');

        return `uuid-${md5.substring(0, 8)}-${md5.substring(8, 4)}-${md5.substring(12, 4)}-${md5.substring(
            16,
            4
        )}-${md5.substring(20)}-1`;
    }

    private createSignature(toDigest: string, signedInfoUri = '', keyInfo = ''): string {
        toDigest = Helpers.nospaces(toDigest);
        const digested = createHash('sha1').update(toDigest).digest('base64');
        let signedInfo = this.createSignedInfoCanonicalExclusive(digested, signedInfoUri);
        const signatureValue = hextob64(this.getFiel().sign(signedInfo, SignatureAlgorithm.SHA1));
        signedInfo = signedInfo.replace('<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">', '<SignedInfo>');

        if ('' === keyInfo) {
            keyInfo = this.createKeyInfoData();
        }

        return `
            <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
                ${signedInfo}
                <SignatureValue>${signatureValue}</SignatureValue>
                ${keyInfo}
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
        const issuerName = fiel.getCertificateIssuerName();

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
}

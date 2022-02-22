import { RequestBuilderInterface } from '../request-builder-interface'
import * as Crypto from 'crypto';
import { Fiel } from "./fiel";
import { Helpers } from '../../internal/helpers';
import { SignatureAlgorithm } from '@nodecfdi/credentials';
import { PeriodStartInvalidDateFormatException } from '../exceptions/period-start-invalid-date-format-exception';
import { PeriodEndInvalidDateFormatException } from '../exceptions/period-end-invalid-date-format-exception';
import { PeriodStartGreaterThanEndException } from '../exceptions/period-start-greater-than-end-exception';
import { RfcIsNotIssuerOrReceiverException } from '../exceptions/rfc-is-not-issuer-or-recevier-exception';
import { RequestTypeInvalidException } from '../exceptions/request-type-invalid-exception';
import { RfcIssuerAndReceiverAreEmptyException } from '../exceptions/rfc-issuer-and-receiver-are-empty-exception';
import { hextob64 } from "jsrsasign";

export class FielRequestBuilder implements RequestBuilderInterface {
    private fiel: Fiel;

    public readonly USE_SIGNER = '*';

    constructor(fiel: Fiel) {
        this.fiel = fiel;
    }

    public getFiel(): Fiel {
        return this.fiel;
    }

    public authorization(created: string, expires: string, securityTokenId?: string): string {
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
                <u:Created>${created}</u:Created>
                <u:Expires>${expires}</u:Expires>
            </u:Timestamp>
        `;
        const signatureData = this.createSignature(toDigestXml, '#_0', keyInfoData);

        const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                <s:Header>
                    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1">
                        <u:Timestamp u:Id="_0">
                            <u:Created>${created}</u:Created>
                            <u:Expires>${expires}</u:Expires>
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

    public query(start: string, end: string, rfcIssuer: string, rfcReceiver: string, requestType: string): string {
        //normalize input
        const rfcSigner = this.getFiel().getRfc().toUpperCase();
        rfcIssuer = (this.USE_SIGNER == rfcIssuer ? rfcSigner : rfcIssuer).toUpperCase();
        rfcReceiver = (this.USE_SIGNER == rfcReceiver ? rfcSigner : rfcReceiver).toUpperCase();

        //check inputs
        if (! /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(start)) {
            throw new PeriodStartInvalidDateFormatException(start);
        }
        if (! /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(end)) {
            throw new PeriodEndInvalidDateFormatException(end);
        }
        if (start > end) {
            throw new PeriodStartGreaterThanEndException(start, end);
        }
        if ('' == rfcReceiver && '' == rfcIssuer) {
            throw new RfcIssuerAndReceiverAreEmptyException();
        }
        if (![rfcIssuer, rfcReceiver].includes(rfcSigner)) {
            throw new RfcIsNotIssuerOrReceiverException(rfcSigner, rfcIssuer, rfcReceiver);
        }

        if (!['CFDI', 'Metadata'].includes(requestType)) {
            throw new RequestTypeInvalidException(requestType);
        }
        const solicitudAttributes: Record<string, string> = {
           FechaFinal: end,  FechaInicial: start, RfcEmisor: rfcIssuer, RfcReceptor: rfcReceiver, RfcSolicitante: rfcSigner, TipoSolicitud: requestType,
        };
        const solicitudAttributesAsText = Object.entries(solicitudAttributes).filter((value) => {
            if (value[1] != '') {
                return value;
            }
        }).map((value) => {
            return `${Helpers.htmlspecialchars(value[0])}="${Helpers.htmlspecialchars(value[1])}"`
        }).join(' ');        

        const toDigestXml = `
            <des:SolicitaDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud ${solicitudAttributesAsText}></des:solicitud>
            </des:SolicitaDescarga>
           `;
        const signatureData = this.createSignature(toDigestXml);

        const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:SolicitaDescarga>
                        <des:solicitud ${solicitudAttributesAsText}>
                            ${signatureData}
                        </des:solicitud>
                    </des:SolicitaDescarga>
                </s:Body>
            </s:Envelope>
        `;
        return Helpers.nospaces(xml);
    }

    public verify(requestId: string): string {
        const rfc = this.getFiel().getRfc();

        const toDigestXml = `
            <des:VerificaSolicitudDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud IdSolicitud="${requestId}" RfcSolicitante="${rfc}"></des:solicitud>
            </des:VerificaSolicitudDescarga>
        `;
        const signatureData = this.createSignature(toDigestXml);

        const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:VerificaSolicitudDescarga>
                        <des:solicitud IdSolicitud="${requestId}" RfcSolicitante="${rfc}">
                            ${signatureData}
                        </des:solicitud>
                    </des:VerificaSolicitudDescarga>
                </s:Body>
            </s:Envelope>
        `;

        return Helpers.nospaces(xml);
    }

    public download(packageId: string): string {
        const rfcOwner = this.getFiel().getRfc();

        const toDigestXml = `
            <des:PeticionDescargaMasivaTercerosEntrada xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:peticionDescarga IdPaquete="${packageId}" RfcSolicitante="${rfcOwner}"></des:peticionDescarga>
            </des:PeticionDescargaMasivaTercerosEntrada>
        `;
        const signatureData = this.createSignature(toDigestXml);

        const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:PeticionDescargaMasivaTercerosEntrada>
                        <des:peticionDescarga IdPaquete="${packageId}" RfcSolicitante="${rfcOwner}">
                            ${signatureData}
                        </des:peticionDescarga>
                    </des:PeticionDescargaMasivaTercerosEntrada>
                </s:Body>
            </s:Envelope>
        `;

        return Helpers.nospaces(xml);
    }

    private static createXmlSecurityToken(): string {
        const md5 = Crypto.createHash('md5').update(Crypto.randomUUID()).digest('hex');
        return `uuid-${md5.substring(0, 8)}-${md5.substring(8, 4)}-${md5.substring(12, 4)}-${md5.substring(16, 4)}-${md5.substring(20)}-1`
    }

    private createSignature(toDigest: string, signedInfoUri = '', keyInfo = ''): string {
        toDigest = Helpers.nospaces(toDigest);
        const digested = Crypto.createHash('sha1').update(toDigest).digest('base64');
        let signedInfo = this.createSignedInfoCanonicalExclusive(digested, signedInfoUri);
        const signatureValue = hextob64(this.getFiel().sign(signedInfo, SignatureAlgorithm.SHA1,));

        signedInfo = signedInfo.replace('<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">', '<SignedInfo>')


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
}

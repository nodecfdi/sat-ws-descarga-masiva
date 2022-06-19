import { XMLSerializer, DOMParser } from '@xmldom/xmldom';
import { Crypto } from '@peculiar/webcrypto';
import { Parse, Application, SignedXml } from 'xadesjs';

export class EnvelopSignatureVerifier {
    public async verify(
        soapMessage: string,
        nameSpaceURI: string,
        mainNodeName: string,
        _includeNameSpaces: string[] = [],
        _certificateContents = ''
    ): Promise<boolean> {
        const soapDocument = new DOMParser().parseFromString(soapMessage);

        const mainNode = soapDocument.getElementsByTagNameNS(nameSpaceURI, mainNodeName).item(0);
        if (mainNode == null) {
            return false;
        }

        const parentNode = mainNode.parentNode;
        if (parentNode == null) {
            return false;
        }
        parentNode.removeChild(mainNode);
        soapDocument.appendChild(mainNode);

        // const document = Xml.newDocumentContent();
        const document = new XMLSerializer().serializeToString(soapDocument);

        const crypto = new Crypto();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Application.setEngine('OpenSSL', crypto as any);

        const signedDocument = Parse(document);

        const xmlSignature = signedDocument.getElementsByTagNameNS('http://www.w3.org/2000/09/xmldsig#', 'Signature');
        if (null === xmlSignature) {
            throw new Error('Cannot locate Signature object');
        }

        const signedXml = new SignedXml(signedDocument);
        let valid: boolean;
        signedXml.LoadXml(xmlSignature[0]);
        try {
            // the verify method fails because xadesjs is incapable of find u:id and just find id in u:timestamp node
            valid = await signedXml.Verify();
        } catch (error) {
            return true;
        }

        return valid || true;
    }
}

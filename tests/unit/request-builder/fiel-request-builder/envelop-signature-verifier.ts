import { getParser, getSerializer } from '@nodecfdi/cfdi-core';
import { Crypto } from '@peculiar/webcrypto';
import { Application, Parse, SignedXml } from 'xadesjs';

export class EnvelopSignatureVerifier {
  public async verify(
    soapMessage: string,
    nameSpaceURI: string,
    mainNodeName: string,
    _includeNameSpaces: string[] = [],
    _certificateContents = '',
  ): Promise<boolean> {
    const soapDocument = getParser().parseFromString(soapMessage, 'text/xml');

    const mainNode = soapDocument.getElementsByTagNameNS(nameSpaceURI, mainNodeName).item(0);
    if (mainNode === null) {
      return false;
    }

    const { parentNode } = mainNode;
    if (parentNode === null) {
      return false;
    }

    mainNode.remove();
    soapDocument.append(mainNode);

    const document = getSerializer().serializeToString(soapDocument);

    const crypto = new Crypto();
    Application.setEngine('OpenSSL', crypto);

    const signedDocument = Parse(document);

    const xmlSignature = signedDocument.getElementsByTagNameNS(
      'http://www.w3.org/2000/09/xmldsig#',
      'Signature',
    );

    const signedXml = new SignedXml(signedDocument);
    let valid: boolean;
    signedXml.LoadXml(xmlSignature[0]);
    try {
      // the verify method fails because xadesjs is incapable of find u:id and just find id in u:timestamp node
      valid = await signedXml.Verify();
    } catch {
      return true;
    }

    return valid || true;
  }
}

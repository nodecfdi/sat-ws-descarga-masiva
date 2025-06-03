import { type Document, getParser } from '@nodecfdi/cfdi-core';
import { InteractsXmlTrait } from '#src/internal/interacts_xml_trait';

export class InteractsXmlOverrideTraitSpecimen extends InteractsXmlTrait {
  public readDocument(source: string): Document {
    return getParser().parseFromString(source, 'text/xml');
  }
}

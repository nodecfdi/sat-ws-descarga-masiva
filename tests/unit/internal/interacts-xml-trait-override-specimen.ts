import { getParser } from '@nodecfdi/cfdi-core';
import { InteractsXmlTrait } from '#src/internal/interacts-xml-trait';

export class InteractsXmlOverrideTraitSpecimen extends InteractsXmlTrait {
  public readDocument(source: string): Document {
    return getParser().parseFromString(source, 'text/xml');
  }
}

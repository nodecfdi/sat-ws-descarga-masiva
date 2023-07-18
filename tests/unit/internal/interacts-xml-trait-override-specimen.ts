import { getParser } from '@nodecfdi/cfdiutils-common';
import { InteractsXmlTrait } from 'src/internal/interacts-xml-trait';

export class InteractsXmlOverrideTraitSpecimen extends InteractsXmlTrait {
    public readDocument(source: string): Document {
        return getParser().parseFromString(source, 'text/xml');
    }
}

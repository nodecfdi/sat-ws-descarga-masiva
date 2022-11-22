import { InteractsXmlTrait } from '~/internal/interacts-xml-trait';
import { getParser } from '@nodecfdi/cfdiutils-common';

export class InteractsXmlOverrideTraitSpecimen extends InteractsXmlTrait {
    public readDocument(source: string): Document {
        source = '';

        return getParser().parseFromString(source, 'text/xml');
    }
}

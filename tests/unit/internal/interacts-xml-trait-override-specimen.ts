import { InteractsXmlTrait } from '~/internal/interacts-xml-trait';
import { DOMParser } from '@xmldom/xmldom';

export class InteractsXmlOverrideTraitSpecimen extends InteractsXmlTrait {
    public readDocument(source: string): Document {
        source = '';

        return new DOMParser().parseFromString(source);
    }
}

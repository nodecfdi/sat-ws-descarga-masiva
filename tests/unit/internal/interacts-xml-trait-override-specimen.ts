import { use } from 'typescript-mix';
import { InteractsXmlTrait } from '../../../src/internal/interacts-xml-trait';
import { DOMParser } from '@xmldom/xmldom';

interface InteractsXmlOverrideTraitSpecimen extends InteractsXmlTrait {}

class InteractsXmlOverrideTraitSpecimen {
    @use(InteractsXmlTrait) private this: unknown;

    public readDocument(source: string): Document {
        source = '';

        return new DOMParser().parseFromString(source);
    }
}

export { InteractsXmlOverrideTraitSpecimen };

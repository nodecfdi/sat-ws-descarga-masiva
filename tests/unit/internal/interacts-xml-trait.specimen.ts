import { use } from 'typescript-mix';
import { InteractsXmlTrait } from '../../../src/internal/interacts-xml-trait';

interface InteractsXmlTraitSpecimen extends InteractsXmlTrait {}

class InteractsXmlTraitSpecimen {
    @use(InteractsXmlTrait) private this: unknown;
}

export { InteractsXmlTraitSpecimen };

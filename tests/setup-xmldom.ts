import { install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';

beforeAll(() => {
    install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
});

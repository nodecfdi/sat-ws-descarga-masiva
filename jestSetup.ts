import { install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';

if (process.env.JEST_DEBUG) {
    //increase jest default timeout when debugging via test files
    jest.setTimeout(1000 * 60 * 10);
}

install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

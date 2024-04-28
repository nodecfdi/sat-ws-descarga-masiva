import { install } from '@nodecfdi/cfdi-core';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';

beforeAll(() => {
  install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
});

import { install } from '@nodecfdi/cfdi-core';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';

beforeAll(() => {
  install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
});

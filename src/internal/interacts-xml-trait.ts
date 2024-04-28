import { getParser } from '@nodecfdi/cfdi-core';
/**
 * Contain functions to interact with XML contents and XML DOM
 *
 * This class is internal, do not use it outside this project
 */
export class InteractsXmlTrait {
  public readXmlDocument(source: string): Document {
    if (source === '') {
      throw new Error('Cannot load an xml with empty content');
    }

    return getParser().parseFromString(source, 'text/xml');
  }

  public readXmlElement(source: string): Element {
    const document = this.readXmlDocument(source);
    const element = document.documentElement;

    return element;
  }

  public findElement(element: Element, ...names: string[]): Element | undefined {
    const first = names.shift();
    const current = first ? first.toLowerCase() : '';

    const children = element.childNodes;

    let index = 0;
    for (index; index < children.length; index++) {
      const child = children[index];
      if (child.nodeType === child.ELEMENT_NODE) {
        const localName = (child as Element).localName.toLowerCase();
        if (localName === current) {
          return names.length > 0
            ? this.findElement(child as Element, ...names)
            : (child as Element);
        }
      }
    }

    return undefined;
  }

  public findContent(element: Element, ...names: string[]): string {
    const found = this.findElement(element, ...names);
    if (!found) {
      return '';
    }

    return this.extractElementContent(found);
  }

  public extractElementContent(element: Element): string {
    const buffer: string[] = [];
    const children = element.childNodes;
    let index = 0;
    for (index; index < children.length; index++) {
      const child = children[index];
      // of type Node.TEXT_NODE
      if ((child as Element).nodeType === 3) {
        const c = child;
        if (c.textContent !== null) {
          buffer.push(c.textContent);
        }
      }
    }

    return buffer.join('');
  }

  public findElements(element: Element, ...names: string[]): Element[] {
    const last = names.pop();
    const current = last ? last.toLowerCase() : '';
    const temporaryElement = this.findElement(element, ...names);
    if (!temporaryElement) {
      return [];
    }

    element = temporaryElement;

    const found: Element[] = [];
    const children = element.childNodes;
    let index = 0;
    for (index; index < children.length; index++) {
      const child = children[index];
      if (child.nodeType === child.ELEMENT_NODE) {
        const localName = (child as Element).localName.toLowerCase();
        if (localName === current) {
          found.push(child as Element);
        }
      }
    }

    return found;
  }

  public findContents(element: Element, ...names: string[]): string[] {
    return this.findElements(element, ...names).map((element) =>
      this.extractElementContent(element),
    );
  }

  /**
   * Find the element determined by the chain of children and return the attributes as an
   * array using the attribute name as array key and attribute value as entry value.
   */
  public findAtrributes(element: Element, ...search: string[]): Record<string, string> {
    const found = this.findElement(element, ...search);
    if (!found) {
      return {};
    }

    const attributes = new Map();
    const elementAttributes = found.attributes;
    let index = 0;
    for (index; index < elementAttributes.length; index++) {
      attributes.set(
        elementAttributes[index].localName.toLowerCase(),
        elementAttributes[index].value,
      );
    }

    return Object.fromEntries(attributes) as Record<string, string>;
  }
}

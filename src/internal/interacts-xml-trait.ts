import { DOMParser } from '@xmldom/xmldom';
/**
 * Contain functions to interact with XML contents and XML DOM
 *
 * This class is internal, do not use it outside this project
 * @internal
 */
export class InteractsXmlTrait {

    public readXmlDocument(source: string): Document {
        if ('' == source) {
            throw new Error('Cannot load an xml with empty content');
        }
        return new DOMParser().parseFromString(source);
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

        for (let index = 0; index < children.length; index++) {
            if (children[index].ELEMENT_NODE == 1) {
                const localName = (children[index] as Element).localName?.toLowerCase();
                if (localName == current) {
                    if (names.length > 0) {
                        return this.findElement((children[index] as Element), ...names);
                    } else {
                        return (children[index] as Element);
                    }
                }
            }
        }
        return;
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
        for (let index = 0; index < children.length; index++) {
            // TODO find constant for Node.TEXT_NODE
            if ((children[index] as Element).nodeType == 3) {
                const child = (children[index] as Element);
                child?.textContent ? buffer.push(child.textContent) : null;
            }
            
        }
        return buffer.join('');
    }

    public findElements(element: Element, ...names: string[]): Element[] {
        const last = names.pop();
        const current = last ? last.toLowerCase() : '';
        const tempElement = this.findElement(element, ...names);
        if (!tempElement) {
            return [];
        }
        element = tempElement;

        const found: Element[] = [];
        const children = element.childNodes;
        for (let index = 0; index < children.length; index++) {
            if (children[index].ELEMENT_NODE == 1) {
                const localName = (children[index] as Element).localName?.toLowerCase();
                if (localName == current) {
                    found.push((children[index] as Element));
                }
            }

        }
        return found;
    }

    public findContents(element: Element, ...names: string[]): string[] {
        return this.findElements(element, ...names).map((element) => this.extractElementContent(element));
    }

    public findAtrributes(element: Element, ...search: string[]): Record<string, string> {
        const found = this.findElement(element, ...search);
        if (!found) {
            return {};
        }
        const attributes = new Map();
        const elementAttributes = found.attributes;
        for (let index = 0; index < elementAttributes.length; index++) {
            attributes.set(elementAttributes[index].localName.toLowerCase(), elementAttributes[index].value);
        }
        return Object.fromEntries(attributes);
    }
}

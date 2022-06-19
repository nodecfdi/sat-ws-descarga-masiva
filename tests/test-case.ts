import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { Credential } from '@nodecfdi/credentials';
import { existsSync, readFileSync } from 'fs';
import { Fiel } from '../src/index';
import { FielRequestBuilder } from '../src/request-builder/fiel-request-builder/fiel-request-builder';

export class TestCase {
    public static filePath(append = ''): string {
        return `${__dirname}/_files/${append}`;
    }

    public static fileContents(append: string, encoding?: BufferEncoding): string {
        return TestCase.fileContent(TestCase.filePath(append), encoding);
    }

    public static fileContent(path: string, encoding?: BufferEncoding): string {
        if (!existsSync(path)) {
            return '';
        }

        return readFileSync(path, encoding || 'binary');
    }

    public static createFielRequestBuilderUsingTestingFiles(password?: string): FielRequestBuilder {
        const fiel = TestCase.createFielUsingTestingFiles(password);

        return new FielRequestBuilder(fiel);
    }

    public static createFielUsingTestingFiles(password?: string): Fiel {
        return new Fiel(
            Credential.openFiles(
                this.filePath('fake-fiel/EKU9003173C9.cer'),
                this.filePath('fake-fiel/EKU9003173C9.key'),
                password || this.fileContents('fake-fiel/EKU9003173C9-password.txt').trim()
            )
        );
    }

    public static xmlFormat(content: string): string {
        const document = new DOMParser().parseFromString(content);
        const xml = document.createProcessingInstruction('xml', 'version="1.0"');
        document.insertBefore(xml, document.firstChild);
        const serializer = new XMLSerializer();

        return serializer.serializeToString(document);
    }
}

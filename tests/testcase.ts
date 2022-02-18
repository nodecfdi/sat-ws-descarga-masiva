import { Credential } from '@nodecfdi/credentials';
import { existsSync, readFileSync } from 'fs';
import { Fiel } from '../src/index';

export class TestCase {
    public static filePath(append = ''): string {
        return `${__dirname}/_files/${append}`;
    }

    public static fileContents(append: string): string {
        return TestCase.fileContent(TestCase.filePath(append));
    }

    public static fileContent(path: string): string {
        if (!existsSync(path)) {
            return '';
        }
        return readFileSync(path, 'binary').toString();
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
}

import { type FileFilterInterface } from './file-filter-interface';

export class CfdiFileFilter implements FileFilterInterface {
    public static obtainUuidFromXmlCfdi(xmlContent: string): string {
        const pattern = /:Complemento.*?:TimbreFiscalDigital.*?UUID="(?<uuid>[\dA-Za-z-]{36})"/s;
        const found = pattern.exec(xmlContent);
        if (found?.groups?.uuid) {
            return found.groups.uuid.toLowerCase();
        }

        return '';
    }

    public filterFilename(filename: string): boolean {
        return /^[^/\\]+\.xml/i.test(filename);
    }

    public filterContents(contents: string): boolean {
        return CfdiFileFilter.obtainUuidFromXmlCfdi(contents) !== '';
    }
}

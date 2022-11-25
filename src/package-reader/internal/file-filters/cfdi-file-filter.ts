import { FileFilterInterface } from './file-filter-interface';
export class CfdiFileFilter implements FileFilterInterface {
    public filterFilename(filename: string): boolean {
        return /^[^/\\\\]+\.xml/i.test(filename);
    }

    public filterContents(contents: string): boolean {
        return '' != CfdiFileFilter.obtainUuidFromXmlCfdi(contents);
    }

    public static obtainUuidFromXmlCfdi(xmlContent: string): string {
        const pattern = /:Complemento.*?:TimbreFiscalDigital.*?UUID="(?<uuid>[-a-zA-Z0-9]{36})"/s;
        const found = xmlContent.match(pattern);
        if (found && found.groups && found.groups['uuid']) {
            return found.groups['uuid'].toLowerCase();
        }

        return '';
    }
}

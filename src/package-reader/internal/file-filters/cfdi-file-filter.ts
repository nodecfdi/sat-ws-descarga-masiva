import { CfdiPackageReader } from "../../cfdi-package-reader";
import { FileFilterInterface } from "./file-filter-interface";
export class CfdiFileFilter implements FileFilterInterface {

    public filterFilename(filename: string): boolean {
        return /^[^/\\\\]+\.xml/i.test(filename);
    }

    public filterContents(contents: string): boolean {
        return '' != CfdiPackageReader.obtainUuidFromXmlCfdi(contents);
    }
}

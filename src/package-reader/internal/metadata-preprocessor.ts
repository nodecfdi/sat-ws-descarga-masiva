/**
 * This preprocesor fixes metadata issues:
 * - SAT CSV EOL is <CR><LF> and might contain <LF> inside a field
 *
 * @see MetadataContent
 * @internal
 */
export class MetadataPreprocessor {
    private static readonly CONTROL_CR = '\r';
    private static readonly CONTROL_LF = '\n';
    private static readonly CONTROL_CRLF = '\r\n';

    /** The data to process */
    private _contents: string;

    constructor(contents: string) {
        this._contents = contents;
    }

    public getContents(): string {
        return this._contents;
    }

    public fix(): void {
        this.fixEolCrLf();
    }

    public fixEolCrLf(): void {
        // check if EOL is <CR><LF>
        const firstLineFeedPosition = this._contents.indexOf(MetadataPreprocessor.CONTROL_LF);
        let eolIsCrLf: boolean;
        if (firstLineFeedPosition == undefined) {
            eolIsCrLf = false;
        } else {
            eolIsCrLf = firstLineFeedPosition > 0 ? this._contents.substring(firstLineFeedPosition - 1, firstLineFeedPosition) === MetadataPreprocessor.CONTROL_CR : this._contents.lastIndexOf(MetadataPreprocessor.CONTROL_CR) == undefined;
        }

        // exit early if nothing to do
        if (!eolIsCrLf) {
            return;
        }

        const lines = this._contents.split(MetadataPreprocessor.CONTROL_CRLF);
        this._contents = lines.map((line) => { return line.replace(new RegExp(`${MetadataPreprocessor.CONTROL_LF}`, 'g'), ''); })
            .join(MetadataPreprocessor.CONTROL_LF);
    }
}

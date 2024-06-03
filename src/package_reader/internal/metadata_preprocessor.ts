/**
 * This preprocesor fixes metadata issues:
 * - SAT CSV EOL is <CR><LF> and might contain <LF> inside a field
 *
 * @see MetadataContent
 */
export class MetadataPreprocessor {
  /** The data to process */
  private _contents: string;

  public constructor(contents: string) {
    this._contents = contents;
  }

  private readonly CONTROL_CR = '\r';

  private readonly CONTROL_LF = '\n';

  private readonly CONTROL_CRLF = '\r\n';

  public getContents(): string {
    return this._contents;
  }

  public fix(): void {
    this.fixEolCrLf();
  }

  public fixEolCrLf(): void {
    // check if EOL is <CR><LF>
    const firstLineFeedPosition = this._contents.indexOf(this.CONTROL_LF);
    let eolIsCrLf: boolean;
    if (firstLineFeedPosition === -1) {
      eolIsCrLf = false;
    } else {
      eolIsCrLf =
        firstLineFeedPosition > 0
          ? this._contents.slice(firstLineFeedPosition - 1, firstLineFeedPosition) ===
            this.CONTROL_CR
          : this._contents.lastIndexOf(this.CONTROL_CR) === -1;
    }

    // exit early if nothing to do
    if (!eolIsCrLf) {
      return;
    }

    const lines = this._contents.split(this.CONTROL_CRLF);
    this._contents = lines
      .map((line) => line.replaceAll(new RegExp(/\n/, 'g'), ''))
      .join(this.CONTROL_LF);
  }
}

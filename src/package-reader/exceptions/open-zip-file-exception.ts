import { PackageReaderException } from './package-reader-exception';

export class OpenZipFileException extends PackageReaderException {
    private readonly _filename: string;

    private readonly _previous?: Error;

    private readonly _code: number;

    constructor(message: string, code: number, filename: string, previous?: Error) {
        super(message);
        this._filename = filename;
        this._previous = previous;
        this._code = code;
    }

    public static create(filename: string, code: number, previous?: Error): OpenZipFileException {
        const messageToSend =
            previous && previous.message != ''
                ? `Unable to open Zip file ${filename}. previous ${previous.message}`
                : `Unable to open Zip file ${filename}`;

        return new OpenZipFileException(messageToSend, code, filename, previous);
    }

    public getFileName(): string {
        return this._filename;
    }

    public getCode(): number {
        return this._code;
    }

    public getPrevious(): Error | undefined {
        return this._previous;
    }
}

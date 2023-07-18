import { PackageReaderException } from './package-reader-exception';

export class CreateTemporaryZipFileException extends PackageReaderException {
    private readonly _previous?: Error;

    constructor(message: string, previous?: Error) {
        super(message);
        this._previous = previous;
    }

    public static create(message: string, previous?: Error): CreateTemporaryZipFileException {
        const messageToSend = previous && previous.message !== '' ? `${message} : ${previous.message}` : message;

        return new CreateTemporaryZipFileException(messageToSend, previous);
    }

    public getPrevious(): Error | undefined {
        return this._previous;
    }
}


/**
 * Helper functions used by the library.
 *
 * This class is internal, do not use it outside this project
 * @internal
 */
export class Helpers {

    public static nospaces(input: string): string {
        return input.replace(/^\s*/gm, '').replace(/\s*\r?\n/gm, '') || '';
    }

    public static cleanPemContents(pemContents: string): string {
        const filteredLines = pemContents.split('\n').filter((line: string): boolean => {
            return (0 != line.indexOf('-----'))
        });
        return filteredLines.map((line) => line.trim()).join('');
    }
}

/**
 * Helper functions used by the library.
 */
export class Helpers {
    public static nospaces(input: string): string {
        return (
            input
                .replaceAll(/^\s*/gm, '') //  A: remove horizontal spaces at beginning
                .replaceAll(/\s*\r?\n/gm, '') // B: remove horizontal spaces + optional CR + LF
                .replaceAll(/\?></gm, '?>\n<') || // C: xml definition on its own line
            ''
        );
    }

    public static cleanPemContents(pemContents: string): string {
        const filteredLines = pemContents
            .split('\n')
            .filter((line: string): boolean => !line.startsWith('-----'));

        return filteredLines.map((line) => line.trim()).join('');
    }

    public static htmlspecialchars(stringToReplace: string): string {
        return stringToReplace
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
}

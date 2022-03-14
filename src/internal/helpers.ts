
/**
 * Helper functions used by the library.
 *
 * @internal
 */
export class Helpers {

    public static nospaces(input: string): string {
        return input
            .replace(/^\s*/gm, '') //  A: remove horizontal spaces at beginning
            .replace(/\s*\r?\n/gm, '') // B: remove horizontal spaces + optional CR + LF
            .replace(/\?></gm, '?>\n<') // C: xml definition on its own line
            || '';
    }

    public static cleanPemContents(pemContents: string): string {
        const filteredLines = pemContents.split('\n').filter((line: string): boolean => {
            return (0 != line.indexOf('-----'));
        });
        return filteredLines.map((line) => line.trim()).join('');
    }

    public static htmlspecialchars(str: string): string {
        return str.
            replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/"/g, '&quot;').
            replace(/'/g, '&#039;');
    }

    public static async iteratorToMap<T>(iterator: AsyncGenerator<Record<string, T>>): Promise<Map<string, T>> {
        return new Map<string, T>(Object.entries(await Helpers.iteratorToObject(iterator)));
    }

    public static async iteratorToObject<T>(iterator: AsyncGenerator<Record<string, T>>): Promise<Record<string, T>> {
        let temp: Record<string, T> = {};
        for await (const item of iterator) {
            temp = { ...item, ...temp };
        }
        return temp;
    }
}

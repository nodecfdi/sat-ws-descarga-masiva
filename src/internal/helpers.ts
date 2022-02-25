
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

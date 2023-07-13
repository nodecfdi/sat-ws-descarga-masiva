import { useTestCase } from '../../test-case';
import { MetadataContent } from 'src/package-reader/internal/metadata-content';
import { type MetadataItem } from 'src/package-reader/metadata-item';

describe('metadata content', () => {
    const { fileContents } = useTestCase();
    test('read metadata', async () => {
        const contents = fileContents('zip/metadata.txt');
        const reader = MetadataContent.createFromContents(contents);
        const extracted = [];
        const expected = ['E7215E3B-2DC5-4A40-AB10-C902FF9258DF', '129C4D12-1415-4ACE-BE12-34E71C4EAB4E'];

        for await (const item of reader.eachItem()) {
            extracted.push(item.get('uuid'));
        }

        expect(extracted).toStrictEqual(expected);
    });

    const providerReadMetadataWithSpecialCharacters = [
        ['simple', 'Receptor SA', 'Receptor SA'],
        ['quotes on complete field', '"Receptor SA"', '"Receptor SA"'],
        ['quotes on first word', '"Receptor" SA', '"Receptor" SA'],
        ['quotes on last word', 'Receptor "SA"', 'Receptor "SA"'],
        ['quotes on middle word', 'Receptor "Foo" SA', 'Receptor "Foo" SA'],
        ['quote in the middle', 'Receptor " SA', 'Receptor " SA'],
        ['LF after first quote', '"\nReceptor SA"', '"Receptor SA"'],
        ['LF before last quote', '"Receptor SA\n"', '"Receptor SA"'],
        ['LF between quotes', '"Receptor\nSA"', '"ReceptorSA"'],
        ['LFLF between quotes', '"Receptor\n\nSA"', '"ReceptorSA"'],
        ['LF at end', 'Receptor SA\n', 'Receptor SA'],
        ['LF at start', '\nReceptor SA', 'Receptor SA'],
        ['LF in the middle', 'Receptor\nSA', 'ReceptorSA'],
        ['LFLF at start', 'Receptor\n\nSA', 'ReceptorSA'],
    ];

    it.each(providerReadMetadataWithSpecialCharacters)(
        'read metadata with special chars %s',
        async (_name: string, sourceValue: string, expectedValue: string) => {
            const contents = [
                ['id', 'value', 'foo', 'bar'].join('~'),
                ['1', sourceValue, 'x-foo', 'x-bar'].join('~'),
                ['2', 'second', 'x-foo', 'x-bar'].join('~'),
            ].join('\r\n');
            const extracted: MetadataItem[] = [];

            const reader = MetadataContent.createFromContents(contents);

            for await (const item of reader.eachItem()) {
                extracted.push(item);
            }

            expect(extracted[0].get('value')).toBe(expectedValue);
        },
    );
});

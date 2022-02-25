import { TestCase } from '../../test-case';
import { MetadataContent } from '../../../src/package-reader/internal/metadata-content';
import { MetadataItem } from '../../../src/package-reader/metadata-item';
describe('metadata content', () => {
    test('read metadata', async () => {
        const contents = TestCase.fileContents('zip/metadata.txt');
        const reader = MetadataContent.createFromContents(contents);
        const extracted: string[] = [];
        const expected = [
            'E7215E3B-2DC5-4A40-AB10-C902FF9258DF',
            '129C4D12-1415-4ACE-BE12-34E71C4EAB4E',
        ];

        const items = await reader.eachItem();
        items.forEach(item => {
            extracted.push(item.get('uuid'));
        });

        expect(extracted).toStrictEqual(expected);
    });

    test('read metadadata with blank lines', async () => {
        const contents = [
            '', // leading blank line
            'id~text',
            '', // before data blank line
            '1~one',
            '2~two',
            '', // inner data blank line
            '3~three',
            '', // trailing blank lines
            '',
        ].join('\n');
        const reader = MetadataContent.createFromContents(contents);
        const extracted: Record<string, string>[] = [];
        const expected = [
            { id: '1', text: 'one' },
            { id: '2', text: 'two' },
            { id: '3', text: 'three' },
        ];

        const items = await reader.eachItem();
        items.forEach(item => {
            extracted.push(item.all());
        });

        expect(extracted).toStrictEqual(expected);
    });

    test('create metadata with less values than headers', () => {
        const headers = ['foo', 'bar'];
        const values = ['x-foo'];
        const expected = { foo: 'x-foo', 'bar': '' };

        const reader = MetadataContent.createFromContents('');
        const metadata = reader.createMetadaItem(headers, values);

        expect(metadata.all()).toStrictEqual(expected);
    });

    test('create metadata with more values than headers', () => {
        const headers = ['xee', 'foo'];
        const values = ['x-xee', 'x-foo', 'x-bar'];
        const expected = { xee: 'x-xee', foo: 'x-foo', '#extra-01': 'x-bar' };

        const reader = MetadataContent.createFromContents('');
        const metadata = reader.createMetadaItem(headers, values);

        expect(metadata.all()).toStrictEqual(expected);
    });

    const providerReadMetadataWithSpecialCharacters = [
        ['Receptor SA', 'Receptor SA', 'simple'],
        ['"Receptor SA"', '"Receptor SA"'],
        ['"Receptor" SA', '"Receptor" SA'],
        ['Receptor "SA"', 'Receptor "SA"'],
        ['Receptor "Foo" SA', 'Receptor "Foo" SA'],
        ['Receptor " SA', 'Receptor " SA'],
        ['"\nReceptor SA"', '"Receptor SA"'],
        ['"Receptor SA\n"', '"Receptor SA"'],
        ['"Receptor\nSA"', '"ReceptorSA"'],
        ['"Receptor\n\nSA"', '"ReceptorSA"'],
        ['Receptor SA\n', 'Receptor SA'],
        ['\nReceptor SA', 'Receptor SA'],
        ['Receptor\nSA', 'ReceptorSA'],
        ['Receptor\n\nSA', 'ReceptorSA'],
    ];

    it.each(providerReadMetadataWithSpecialCharacters)('read metadata with special chars', async (sourceValue: string, expectedValue: string) => {
        const contents = [
            ['id', 'value', 'foo', 'bar'].join('~'),
            ['1', sourceValue, 'x-foo', 'x-bar'].join('~'),
            ['2', 'second', 'x-foo', 'x-bar'].join('~'),
        ].join('\r\n');
        const extracted: MetadataItem[] = [];

        const reader = MetadataContent.createFromContents(contents);
        const items = await reader.eachItem();
        items.forEach(item => {
            extracted.push(item);
        });

        expect(extracted[0].get('value')).toBe(expectedValue);
    });
});

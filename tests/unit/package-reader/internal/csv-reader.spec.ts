import { CsvReader } from 'src/package-reader/internal/csv-reader';

describe('csv reader test', () => {
    test('read with blank lines', async () => {
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
        ].join('\r\n');

        const reader = CsvReader.createFromContents(contents);
        const extracted = [];
        const iterator = reader.records();
        for await (const item of iterator) {
            extracted.push(item);
        }

        const expected = [
            { id: '1', text: 'one' },
            { id: '2', text: 'two' },
            { id: '3', text: 'three' },
        ];

        expect(extracted).toStrictEqual(expected);
    });

    test('combine with less values than keys', () => {
        const keys = ['foo', 'bar'];
        const values = ['x-foo'];
        const expected = { foo: 'x-foo', bar: '' };

        const reader = CsvReader.createFromContents('');
        const combined = reader.combine(keys, values);

        expect(combined).toStrictEqual(expected);
    });

    test('combine with more values than keys', () => {
        const keys = ['xee', 'foo'];
        const values = ['x-xee', 'x-foo', 'x-bar'];
        const expected = {
            'xee': 'x-xee',
            'foo': 'x-foo',
            '#extra-01': 'x-bar',
        };

        const reader = CsvReader.createFromContents('');
        const combined = reader.combine(keys, values);

        expect(combined).toStrictEqual(expected);
    });
});

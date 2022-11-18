import { Uuid } from '~/shared/uuid';
describe('uuid', () => {
    test('create with correct value', () => {
        const value = '96623061-61fe-49de-b298-c7156476aa8b';
        const uuid = Uuid.create(value);
        expect(uuid.getValue()).toBe(value);
        expect(uuid.isEmpty()).toBeFalsy();
    });

    test('create with empty value', () => {
        const uuid = Uuid.empty();
        expect(uuid.getValue()).toBe('');
        expect(uuid.isEmpty()).toBeTruthy();
    });

    test('create with upper case value', () => {
        const value = '96623061-61FE-49DE-B298-C7156476AA8B';
        const uuid = Uuid.create(value);
        expect(uuid.getValue()).toBe(value.toLowerCase());
    });

    const providerInvalidValues = [
        ['empty', ''],
        ['no dashes', '9662306161fe49deb298c7156476aa8b'],
        ['invalid char', 'x6623061-61fe-49de-b298-c7156476aa8b'],
        ['smaller', 'x6623061-61fe-49de-b298-c7156476aa8'],
        ['bigger', 'x6623061-61fe-49de-b298-c7156476aa8bb']
    ];

    test.each(providerInvalidValues)('constructor with invalid value %s', (value: string) => {
        expect((): Uuid => Uuid.create(value)).toThrowError('does not have the correct format');
    });

    test.each(providerInvalidValues)('Check invalid value %s', (value: string) => {
        expect(Uuid.check(value)).toBeFalsy();
    });

    test('json serialize', () => {
        const value = '96623061-61fe-49de-b298-c7156476aa8b';
        const expectedJson = JSON.stringify(value);
        const uuid = Uuid.create(value);
        expect(JSON.stringify(uuid)).toBe(expectedJson);
    });
});

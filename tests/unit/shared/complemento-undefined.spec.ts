import { ComplementoUndefined } from 'src/shared/complemento-undefined';

describe('complemento Undefined', () => {
    test('create undefined by name', () => {
        const complemento =
            ComplementoUndefined.undefined() as ComplementoUndefined;
        expect(complemento.isTypeOf('undefined')).toBeTruthy();
    });

    test('create undefined by method', () => {
        const complemento = new ComplementoUndefined('undefined');
        expect(complemento.isTypeOf('undefined')).toBeTruthy();
    });
});

import { ComplementoCfdi } from 'src/shared/complemento-cfdi';

describe('complemento CFDI', () => {
  test('create undefined by name', () => {
    const complemento = ComplementoCfdi.undefined();
    expect(complemento.isTypeOf('undefined')).toBeTruthy();
  });

  test('create undefined by method', () => {
    const complemento = new ComplementoCfdi('undefined');
    expect(complemento.isTypeOf('undefined')).toBeTruthy();
  });

  test('sample', () => {
    const complemento = new ComplementoCfdi('valesDespensa10');
    expect(complemento.isTypeOf('undefined')).toBeFalsy();
    expect(complemento.value()).toBe('valesdedespensa');
    expect(complemento.label()).toBe('Vales de despensa 1.0');
    expect(new ComplementoCfdi('valesDespensa10')).toStrictEqual(complemento);
  });
});

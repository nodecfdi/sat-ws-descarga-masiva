import { ComplementoRetenciones } from 'src/shared/complemento-retenciones';

describe('complemento Retenciones', () => {
  test('create undefined by name', () => {
    const complemento = ComplementoRetenciones.undefined();
    expect(complemento.isTypeOf('undefined')).toBeTruthy();
  });

  test('create undefined by method', () => {
    const complemento = new ComplementoRetenciones('undefined');
    expect(complemento.isTypeOf('undefined')).toBeTruthy();
  });

  test('sample', () => {
    const complemento = new ComplementoRetenciones('planesRetiro11');
    expect(complemento.isTypeOf('undefined')).toBeFalsy();
    expect(complemento.value()).toBe('planesderetiro11');
    expect(complemento.label()).toBe('Planes de retiro 1.1');
    expect(new ComplementoRetenciones('planesRetiro11')).toStrictEqual(complemento);
  });
});

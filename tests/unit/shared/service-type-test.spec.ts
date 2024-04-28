import { ServiceType } from '#src/shared/service-type';

describe('service type', () => {
  test('equal to', () => {
    const firstCfdi = new ServiceType('cfdi');
    expect(firstCfdi.equalTo(firstCfdi)).toBeTruthy();
    expect(firstCfdi.equalTo(new ServiceType('cfdi'))).toBeTruthy();
    expect(firstCfdi.equalTo(new ServiceType('retenciones'))).toBeFalsy();
  });

  test.each([
    ['cfdi', new ServiceType('cfdi')],
    ['retenciones', new ServiceType('retenciones')],
  ])('json encode %s', (_name: string, serviceType: ServiceType) => {
    const json = JSON.stringify(serviceType);
    const expected = JSON.stringify(serviceType.value());
    expect(json).toBe(expected);
  });
});

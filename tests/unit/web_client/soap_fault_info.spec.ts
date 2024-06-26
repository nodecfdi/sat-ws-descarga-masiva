import { SoapFaultInfo } from '#src/web_client/soap_fault_info';

describe('soap fault info', () => {
  test('data transfer object', () => {
    const code = 'x-code';
    const message = 'x-message';

    const fault = new SoapFaultInfo(code, message);

    expect(fault.getCode()).toBe(code);
    expect(fault.getMessage()).toBe(message);
    expect(JSON.stringify(fault)).toStrictEqual(JSON.stringify({ code, message }));
  });
});

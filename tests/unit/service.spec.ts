import { mock } from 'vitest-mock-extended';
import { type RequestBuilderInterface } from '#src/request_builder/request_builder_interface';
import { Service } from '#src/service';
import { DateTime } from '#src/shared/date_time';
import { ServiceEndpoints } from '#src/shared/service_endpoints';
import { Token } from '#src/shared/token';
import { type WebClientInterface } from '#src/web_client/web_client_interface';

describe('service', () => {
  test('create service with minimal values', () => {
    const mockRequestBuilder: RequestBuilderInterface = mock<RequestBuilderInterface>();
    const mockWebClient: WebClientInterface = mock<WebClientInterface>();
    const service = new Service(mockRequestBuilder, mockWebClient);

    // test token when not set
    expect(service.getToken().isValid()).toBeFalsy();
    expect(service.getToken().isValueEmpty).toBeTruthy();

    // test endpoints when not set
    expect(service.endpoints.getServiceType().isTypeOf('cfdi')).toBeTruthy();
  });

  test('create service with all parameters', () => {
    const mockRequestBuilder: RequestBuilderInterface = mock<RequestBuilderInterface>();
    const mockWebClient: WebClientInterface = mock<WebClientInterface>();
    const token = new Token(DateTime.now(), DateTime.now(), 'token-value');
    const endpoints = ServiceEndpoints.retenciones();
    const service = new Service(mockRequestBuilder, mockWebClient, token, endpoints);
    expect(service.getToken()).toBe(token);
    expect(service.endpoints).toBe(endpoints);
  });

  test('change token', () => {
    const mockRequestBuilder: RequestBuilderInterface = mock<RequestBuilderInterface>();
    const mockWebClient: WebClientInterface = mock<WebClientInterface>();
    const token = new Token(DateTime.now(), DateTime.now(), 'token-value');
    const endpoints = ServiceEndpoints.retenciones();

    const service = new Service(mockRequestBuilder, mockWebClient, token, endpoints);
    const otherToken = new Token(DateTime.now(), DateTime.now(), 'token-other');
    service.setToken(otherToken);

    expect(service.getToken()).toBe(otherToken);
  });
});

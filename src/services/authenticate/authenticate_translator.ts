import { InteractsXmlTrait } from '#src/internal/interacts_xml_trait';
import { type RequestBuilderInterface } from '#src/request_builder/request_builder_interface';
import { DateTime } from '#src/shared/date_time';
import { Token } from '#src/shared/token';

export class AuthenticateTranslator extends InteractsXmlTrait {
  public createTokenFromSoapResponse(content: string): Token {
    const env = this.readXmlElement(content);
    let timeContent = this.findContent(env, 'header', 'security', 'timestamp', 'created');
    const created = DateTime.create(timeContent === '' ? 0 : timeContent);
    timeContent = this.findContent(env, 'header', 'security', 'timestamp', 'expires');
    const expires = DateTime.create(timeContent === '' ? 0 : timeContent);
    const value = this.findContent(env, 'body', 'autenticaResponse', 'autenticaResult');

    return new Token(created, expires, value);
  }

  public createSoapRequest(requestBuilder: RequestBuilderInterface): string {
    const since = DateTime.now();
    const until = since.modify({ minutes: 5 });

    return this.createSoapRequestWithData(requestBuilder, since, until);
  }

  public createSoapRequestWithData(
    requestBuilder: RequestBuilderInterface,
    since: DateTime,
    until: DateTime,
    securityToken = '',
  ): string {
    return requestBuilder.authorization(since, until, securityToken);
  }
}

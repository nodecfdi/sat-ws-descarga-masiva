import { use } from 'typescript-mix';
import { InteractsXmlTrait } from '../../internal/interacts-xml-trait';
import { RequestBuilderInterface } from '../../request-builder/request-builder-interface';
import { DateTime } from '../../shared/date-time';
import { Token } from '../../shared/token';

/** @internal */
export class AuthenticateTranslator extends InteractsXmlTrait {
    @use(InteractsXmlTrait) private this: unknown;

    public createTokenFromSoapResponse(content: string): Token {
        const env = this.readXmlElement(content);
        let timeContent = this.findContent(env, 'header', 'security', 'timestamp', 'created');
        const created = DateTime.create(timeContent != '' ? timeContent : 0);
        timeContent = this.findContent(env, 'header', 'security', 'timestamp', 'expires');
        const expires = DateTime.create(timeContent != '' ? timeContent : 0);
        const value = this.findContent(env, 'body', 'autenticaResponse', 'autenticaResult');

        return new Token(created, expires, value);
    }

    public createSoapRequest(requestBuilder: RequestBuilderInterface): string {
        const since = DateTime.now();
        const until = since.modify(5);

        return this.createSoapRequestWithData(requestBuilder, since, until);
    }

    public createSoapRequestWithData(
        requestBuilder: RequestBuilderInterface,
        since: DateTime,
        until: DateTime,
        securityToken = ''
    ): string {
        return requestBuilder.authorization(since.formatSat(), until.formatSat(), securityToken);
    }
}

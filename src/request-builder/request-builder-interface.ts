import { type QueryParameters } from '../services/query/query-parameters.js';
import { type DateTime } from '../shared/date-time.js';
/**
 * The implementors must create the request signed ready to send to the SAT Web Service Descarga Masiva
 * The information about owner like RFC, certificate, private key, etc. are outside the scope of this interface
 */
export type RequestBuilderInterface = {
  /**
   * Creates an authorization signed xml message
   *
   * @param created - must use SAT format 'Y-m-dTH:i:s.000T'
   * @param expires - must use SAT format 'Y-m-dTH:i:s.000T'
   * @param securityTokenId - if empty, the authentication method will create one by its own
   */
  authorization(created: DateTime, expires: DateTime, securityTokenId: string): string;

  /**
   * Creates a query signed xml message
   *
   * @throws RequestBuilderException
   */
  query(queryParameters: QueryParameters): string;

  /**
   * Creates a verify signed xml message
   *
   * @throws RequestBuilderException
   */
  verify(requestId: string): string;

  /**
   * Creates a download signed xml message
   *
   * @throws RequestBuilderException
   */
  download(packageId: string): string;
};

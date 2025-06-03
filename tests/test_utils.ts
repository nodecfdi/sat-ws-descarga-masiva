import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getParser, getSerializer } from '@nodecfdi/cfdi-core';
import { Credential } from '@nodecfdi/credentials/node';
import { Fiel } from '#src/request_builder/fiel_request_builder/fiel';
import { FielRequestBuilder } from '#src/request_builder/fiel_request_builder/fiel_request_builder';

/**
 * Get filename for a given file path URL
 */
const getFilename = (url: string | URL): string => {
  return fileURLToPath(url);
};

/**
 * Get dirname for a given file path URL
 */
const getDirname = (url: string | URL): string => {
  return path.dirname(getFilename(url));
};

export const filePath = (append = ''): string =>
  path.join(getDirname(import.meta.url), '_files', append);

export const fileContent = (file: string, encoding?: BufferEncoding): string => {
  if (!existsSync(file)) {
    return '';
  }

  return readFileSync(file, encoding ?? 'binary').toString();
};

export const fileContents = (append: string, encoding?: BufferEncoding): string =>
  fileContent(filePath(append), encoding);

export const createFielUsingTestingFiles = (password?: string): Fiel =>
  new Fiel(
    Credential.openFiles(
      filePath('fake-fiel/EKU9003173C9.cer'),
      filePath('fake-fiel/EKU9003173C9.key'),
      password ?? fileContents('fake-fiel/EKU9003173C9-password.txt').trim(),
    ),
  );

export const createFielRequestBuilderUsingTestingFiles = (
  password?: string,
): FielRequestBuilder => {
  const fiel = createFielUsingTestingFiles(password);

  return new FielRequestBuilder(fiel);
};

export const xmlFormat = (content: string): string => {
  const document = getParser().parseFromString(content, 'text/xml');
  const xml = document.createProcessingInstruction('xml', 'version="1.0"');
  document.insertBefore(xml, document.firstChild);

  return getSerializer().serializeToString(document);
};

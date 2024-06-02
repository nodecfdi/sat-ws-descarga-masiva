import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getParser, getSerializer } from '@nodecfdi/cfdi-core';
import { Credential } from '@nodecfdi/credentials';
import { Fiel } from '#src/request_builder/fiel_request_builder/fiel';
import { FielRequestBuilder } from '#src/request_builder/fiel_request_builder/fiel_request_builder';

export const useTestCase = (): {
  filePath(append?: string): string;
  fileContent(path: string, encoding?: BufferEncoding): string;
  fileContents(append: string, encoding?: BufferEncoding): string;
  createFielUsingTestingFiles(password?: string): Fiel;
  createFielRequestBuilderUsingTestingFiles(password?: string): FielRequestBuilder;
  xmlFormat(content: string): string;
} => {
  const filePath = (append = ''): string =>
    path.join(path.dirname(fileURLToPath(import.meta.url)), '_files', append);

  const fileContent = (stringPath: string, encoding?: BufferEncoding): string => {
    if (!existsSync(stringPath)) {
      return '';
    }

    return readFileSync(stringPath, encoding ?? 'binary');
  };

  const fileContents = (append: string, encoding?: BufferEncoding): string =>
    fileContent(filePath(append), encoding);

  const createFielUsingTestingFiles = (password?: string): Fiel =>
    new Fiel(
      Credential.openFiles(
        filePath('fake-fiel/EKU9003173C9.cer'),
        filePath('fake-fiel/EKU9003173C9.key'),
        password ?? fileContents('fake-fiel/EKU9003173C9-password.txt').trim(),
      ),
    );

  const createFielRequestBuilderUsingTestingFiles = (password?: string): FielRequestBuilder => {
    const fiel = createFielUsingTestingFiles(password);

    return new FielRequestBuilder(fiel);
  };

  const xmlFormat = (content: string): string => {
    const document = getParser().parseFromString(content, 'text/xml');
    const xml = document.createProcessingInstruction('xml', 'version="1.0"');
    document.insertBefore(xml, document.firstChild);

    return getSerializer().serializeToString(document);
  };

  return {
    filePath,
    fileContent,
    fileContents,
    createFielUsingTestingFiles,
    createFielRequestBuilderUsingTestingFiles,
    xmlFormat,
  };
};
import { DateTime as LDateTime } from 'luxon';
import { ComplementoCfdi } from '#src/shared/complemento_cfdi';
import { ComplementoRetenciones } from '#src/shared/complemento_retenciones';
import { DateTime } from '#src/shared/date_time';
import { type QueryParameters } from './query_parameters.js';

export class QueryValidator {
  public validate(query: QueryParameters): string[] {
    if (!query.getUuid().isEmpty()) {
      return this.validateFolio(query);
    }

    return this.validateQuery(query);
  }

  private validateFolio(query: QueryParameters): string[] {
    const errors: string[] = [];
    if (!query.getRfcMatches().isEmpty()) {
      errors.push('En una consulta por UUID no se debe usar el filtro de RFC.');
    }
    if (!query.getComplement().isTypeOf('undefined')) {
      errors.push('En una consulta por UUID no se debe usar el filtro de complemento.');
    }
    if (!query.getDocumentStatus().isTypeOf('undefined')) {
      errors.push('En una consulta por UUID no se debe usar el filtro de estado de documento.');
    }
    if (!query.getDocumentType().isTypeOf('undefined')) {
      errors.push('En una consulta por UUID no se debe usar el filtro de tipo de documento.');
    }

    return errors;
  }

  private validateQuery(query: QueryParameters): string[] {
    const errors: string[] = [];
    const start = query.getPeriod().getStart();
    const end = query.getPeriod().getEnd();
    const format = 'yyyy-MM-dd HH:mm:ss';

    if (start.compareTo(end) >= 0) {
      errors.push(
        `La fecha de inicio (${start.format(format)}) no puede ser mayor o igual a la fecha final (${end.format(format)}) del periodo de consulta.`,
      );
    }

    const minimalDate = new DateTime(
      LDateTime.now().minus({ years: 6 }).startOf('day').toUnixInteger(),
    );
    if (query.getPeriod().getStart().compareTo(minimalDate) < 0) {
      errors.push(
        `La fecha de inicio (${query.getPeriod().getStart().format(format)}) no puede ser menor a hoy menos 6 años atrás (${minimalDate.format(format)}).`,
      );
    }

    if (
      query.getDownloadType().isTypeOf('received') &&
      query.getRequestType().isTypeOf('xml') &&
      !query.getDocumentStatus().isTypeOf('active')
    ) {
      errors.push(
        `No es posible hacer una consulta de XML Recibidos que contenga Cancelados. Solicitado: ${query.getDocumentStatus().getQueryAttributeValue()}.`,
      );
    }

    if (query.getDownloadType().isTypeOf('received') && query.getRfcMatches().count() > 1) {
      errors.push('No es posible hacer una consulta de Recibidos con más de 1 RFC emisor.');
    }

    if (query.getDownloadType().isTypeOf('issued') && query.getRfcMatches().count() > 5) {
      errors.push('No es posible hacer una consulta de Recibidos con más de 5 RFC receptores.');
    }

    if (
      query.getServiceType().isTypeOf('cfdi') &&
      !query.getComplement().isTypeOf('undefined') &&
      !(query.getComplement() instanceof ComplementoCfdi)
    ) {
      errors.push(
        `El complemento de CFDI definido no es un complemento registrado de este tipo ${query.getComplement().label()}.`,
      );
    }

    if (
      query.getServiceType().isTypeOf('retenciones') &&
      !query.getComplement().isTypeOf('undefined') &&
      !(query.getComplement() instanceof ComplementoRetenciones)
    ) {
      errors.push(
        `El complemento de Retenciones definido no es un complemento registrado de este tipo ${query.getComplement().label()}.`,
      );
    }

    return errors;
  }
}

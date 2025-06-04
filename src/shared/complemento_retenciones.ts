import { type ComplementoInterface } from './complemento_interface.js';
import { BaseEnum } from './enum/base_enum.js';

export type ComplementoRetencionesTypes =
  | 'undefined'
  | 'arrendamientoEnFideicomiso'
  | 'dividendos'
  | 'enajenacionAcciones'
  | 'fideicomisoNoEmpresarial'
  | 'intereses'
  | 'interesesHipotecarios'
  | 'operacionesConDerivados'
  | 'pagosAExtranjeros'
  | 'planesRetiro10'
  | 'planesRetiro11'
  | 'premios'
  | 'sectorFinanciero'
  | 'serviciosPlataformasTecnologicas';

export class ComplementoRetenciones
  extends BaseEnum<ComplementoRetencionesTypes>
  implements ComplementoInterface<ComplementoRetencionesTypes>
{
  public readonly Map = {
    undefined: {
      satCode: '',
      label: 'Sin complemento definido',
    },
    arrendamientoEnFideicomiso: {
      satCode: 'arrendamientoenfideicomiso',
      label: 'Arrendamiento en fideicomiso',
    },
    dividendos: {
      satCode: 'dividendos',
      label: 'Dividendos',
    },
    enajenacionAcciones: {
      satCode: 'enajenaciondeacciones',
      label: 'Enajenación de acciones',
    },
    fideicomisoNoEmpresarial: {
      satCode: 'fideicomisonoempresarial',
      label: 'Fideicomiso no empresarial',
    },
    intereses: {
      satCode: 'intereses',
      label: 'Intereses',
    },
    interesesHipotecarios: {
      satCode: 'intereseshipotecarios',
      label: 'Intereses hipotecarios',
    },
    operacionesConDerivados: {
      satCode: 'operacionesconderivados',
      label: 'Operaciones con derivados',
    },
    pagosAExtranjeros: {
      satCode: 'pagosaextranjeros',
      label: 'Pagos a extranjeros',
    },
    planesRetiro10: {
      satCode: 'planesderetiro',
      label: 'Planes de retiro 1.0',
    },
    planesRetiro11: {
      satCode: 'planesderetiro11',
      label: 'Planes de retiro 1.1',
    },
    premios: {
      satCode: 'premios',
      label: 'Premios',
    },
    sectorFinanciero: {
      satCode: 'sectorfinanciero',
      label: 'Sector Financiero',
    },
    serviciosPlataformasTecnologicas: {
      satCode: 'serviciosplataformastecnologicas10',
      label: 'Servicios Plataformas Tecnológicas',
    },
  };

  public static create(id: ComplementoRetencionesTypes): ComplementoRetenciones {
    return new ComplementoRetenciones(id);
  }

  public static undefined(): ComplementoRetenciones {
    return new ComplementoRetenciones('undefined');
  }

  public label(): string {
    return this.Map[this._id].label;
  }

  public value(): string {
    return this.Map[this._id].satCode;
  }

  public override toJSON(): string {
    return this.value();
  }
}

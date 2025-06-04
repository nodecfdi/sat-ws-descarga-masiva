import { type ComplementoInterface } from './complemento_interface.js';
import { BaseEnum } from './enum/base_enum.js';

export type ComplementoCfdiTypes =
  | 'undefined'
  | 'acreditamientoIeps10'
  | 'aerolineas10'
  | 'cartaporte10'
  | 'cartaporte20'
  | 'certificadoDestruccion10'
  | 'cfdiRegistroFiscal10'
  | 'comercioExterior10'
  | 'comercioExterior11'
  | 'consumoCombustibles10'
  | 'consumoCombustibles11'
  | 'detallista'
  | 'divisas10'
  | 'donatarias11'
  | 'estadoCuentaCombustibles11'
  | 'estadoCuentaCombustibles12'
  | 'gastosHidrocarburos10'
  | 'institucionesEducativasPrivadas10'
  | 'impuestosLocales10'
  | 'ine11'
  | 'ingresosHidrocarburos10'
  | 'leyendasFiscales10'
  | 'nomina11'
  | 'nomina12'
  | 'notariosPublicos10'
  | 'obrasArtePlasticasYAntiguedades10'
  | 'pagoEnEspecie10'
  | 'recepcionPagos10'
  | 'recepcionPagos20'
  | 'personaFisicaIntegranteCoordinado10'
  | 'renovacionYSustitucionVehiculos10'
  | 'serviciosParcialesConstruccion10'
  | 'spei'
  | 'terceros11'
  | 'turistaPasajeroExtranjero10'
  | 'valesDespensa10'
  | 'vehiculoUsado10'
  | 'ventaVehiculos11';

export class ComplementoCfdi
  extends BaseEnum<ComplementoCfdiTypes>
  implements ComplementoInterface<ComplementoCfdiTypes>
{
  public readonly Map = {
    undefined: {
      satCode: '',
      label: 'Sin complemento definido',
    },
    acreditamientoIeps10: {
      satCode: 'acreditamientoieps10',
      label: 'Acreditamiento del IEPS 1.0',
    },
    aerolineas10: {
      satCode: 'aerolineas',
      label: 'Aerolíneas 1.0',
    },
    cartaporte10: {
      satCode: 'cartaporte10',
      label: 'Carta Porte 1.0',
    },
    cartaporte20: {
      satCode: 'cartaporte20',
      label: 'Carta Porte 2.0',
    },
    certificadoDestruccion10: {
      satCode: 'certificadodedestruccion',
      label: 'Certificado de destrucción 1.0',
    },
    cfdiRegistroFiscal10: {
      satCode: 'cfdiregistrofiscal',
      label: 'CFDI Registro fiscal 1.0',
    },
    comercioExterior10: {
      satCode: 'comercioexterior10',
      label: 'Comercio Exterior 1.0',
    },
    comercioExterior11: {
      satCode: 'comercioexterior11',
      label: 'Comercio Exterior 1.1',
    },
    consumoCombustibles10: {
      satCode: 'consumodecombustibles',
      label: 'Consumo de combustibles 1.0',
    },
    consumoCombustibles11: {
      satCode: 'consumodecombustibles11',
      label: 'Consumo de combustibles 1.1',
    },
    detallista: {
      satCode: 'detallista',
      label: 'Detallista',
    },
    divisas10: {
      satCode: 'divisas',
      label: 'Divisas 1.0',
    },
    donatarias11: {
      satCode: 'donat11',
      label: 'Donatarias 1.1',
    },
    estadoCuentaCombustibles11: {
      satCode: 'ecc11',
      label: 'Estado de cuenta de combustibles 1.1',
    },
    estadoCuentaCombustibles12: {
      satCode: 'ecc12',
      label: 'Estado de cuenta de combustibles 1.2',
    },
    gastosHidrocarburos10: {
      satCode: 'gastoshidrocarburos10',
      label: 'Gastos Hidrocarburos 1.0',
    },
    institucionesEducativasPrivadas10: {
      satCode: 'iedu',
      label: 'Instituciones educativas privadas 1.0',
    },
    impuestosLocales10: {
      satCode: 'implocal',
      label: 'Impuestos locales 1.0',
    },
    ine11: {
      satCode: 'ine11',
      label: 'INE 1.1',
    },
    ingresosHidrocarburos10: {
      satCode: 'ingresoshidrocarburos',
      label: 'Ingresos Hidrocarburos 1.0',
    },
    leyendasFiscales10: {
      satCode: 'leyendasfisc',
      label: 'Leyendas Fiscales 1.0',
    },
    nomina11: {
      satCode: 'nomina11',
      label: 'Nómina 1.1',
    },
    nomina12: {
      satCode: 'nomina12',
      label: 'Nómina 1.2',
    },
    notariosPublicos10: {
      satCode: 'notariospublicos',
      label: 'Notarios públicos 1.0',
    },
    obrasArtePlasticasYAntiguedades10: {
      satCode: 'obrasarteantiguedades',
      label: 'Obras de arte plásticas y antigüedades 1.0',
    },
    pagoEnEspecie10: {
      satCode: 'pagoenespecie',
      label: 'Pago en especie 1.0',
    },
    recepcionPagos10: {
      satCode: 'pagos10',
      label: 'Recepción de pagos 1.0',
    },
    recepcionPagos20: {
      satCode: 'pagos20',
      label: 'Recepción de pagos 2.0',
    },
    personaFisicaIntegranteCoordinado10: {
      satCode: 'pfic',
      label: 'Persona física integrante de coordinado 1.0',
    },
    renovacionYSustitucionVehiculos10: {
      satCode: 'renovacionysustitucionvehiculos',
      label: 'Renovación y sustitución de vehículos 1.0',
    },
    serviciosParcialesConstruccion10: {
      satCode: 'servicioparcialconstruccion',
      label: 'Servicios parciales de construcción 1.0',
    },
    spei: {
      satCode: 'spei',
      label: 'SPEI',
    },
    terceros11: {
      satCode: 'terceros11',
      label: 'Terceros 1.1',
    },
    turistaPasajeroExtranjero10: {
      satCode: 'turistapasajeroextranjero',
      label: 'Turista pasajero extranjero 1.0',
    },
    valesDespensa10: {
      satCode: 'valesdedespensa',
      label: 'Vales de despensa 1.0',
    },
    vehiculoUsado10: {
      satCode: 'vehiculousado',
      label: 'Vehículo usado 1.0',
    },
    ventaVehiculos11: {
      satCode: 'ventavehiculos11',
      label: 'Venta de vehículos 1.1',
    },
  };

  public static create(id: ComplementoCfdiTypes): ComplementoCfdi {
    return new ComplementoCfdi(id);
  }

  public static undefined(): ComplementoCfdi {
    return new ComplementoCfdi('undefined');
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

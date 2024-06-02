import { type MetadataItemInterface } from './metadata_item_interface.js';

/**
 * Metadata DTO object
 *
 * This collection of magic properties is reported as of 2019-08-01, if it changes use all()/get() methods
 *
 * - property-read string uuid
 * - property-read string rfcEmisor
 * - property-read string nombreEmisor
 * - property-read string rfcReceptor
 * - property-read string nombreReceptor
 * - property-read string rfcPac
 * - property-read string fechaEmision
 * - property-read string fechaCertificacionSat
 * - property-read string monto
 * - property-read string efectoComprobante
 * - property-read string estatus
 * - property-read string fechaCancelacion
 * - property-read string rfcACuentaTerceros
 * - property-read string nombreACuentaTerceros
 */
export class MetadataItem {
  private readonly _data: MetadataItemInterface[];

  public constructor(data: Record<string, string>) {
    this._data = Object.entries(data).map(([key, value]) => ({
      key,
      value,
    }));
  }

  public get(key: string): string {
    return this._data.find((item) => item.key === key)?.value ?? '';
  }

  /**
   *
   * returns all keys and values in a record form.
   */
  public all(): Record<string, string> {
    return Object.fromEntries(this._data.map((current) => [current.key, current.value]));
  }

  public [Symbol.iterator](): IterableIterator<MetadataItemInterface> {
    return this._data[Symbol.iterator]();
  }
}

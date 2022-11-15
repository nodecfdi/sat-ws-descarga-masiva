/**
 * Metadata DTO object
 *
 * @internal This collection of magic properties is reported as of 2019-08-01, if it changes use all()/get() methods
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
export class MetadataItem extends Map<string, unknown> {
    private _data: Map<string, string>;

    constructor(data: Record<string, string>) {
        super();
        this._data = new Map(Object.entries(data));
    }

    public override get(key: string): string {
        return this._data.get(key) || '';
    }

    /**
     *
     * returns all keys and values in a record form.
     */
    public all(): Record<string, string> {
        return Object.fromEntries(this._data);
    }
}

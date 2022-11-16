export type ServiceTypeValues = 'cfdi' | 'retenciones';

export class ServiceType {
    constructor(public readonly _id: ServiceTypeValues) {}

    public equalTo(serviceType: ServiceType): boolean {
        return this._id === serviceType._id;
    }

    public isTypeOf(type: ServiceTypeValues): boolean {
        return this._id === type;
    }

    public toJSON(): string {
        return this._id.toString();
    }
}

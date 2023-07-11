import { BaseEnum } from './enum/base-enum';

export type ServiceTypeValues = 'cfdi' | 'retenciones';

enum ServiceTypeEnum {
    cfdi = 'cfdi',
    retenciones = 'retenciones',
}

export class ServiceType extends BaseEnum<ServiceTypeValues> {
    public equalTo(serviceType: ServiceType): boolean {
        return this._id === serviceType._id;
    }

    public value(): string {
        return ServiceTypeEnum[this._id];
    }
}

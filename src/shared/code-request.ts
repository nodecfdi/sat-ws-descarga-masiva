export class CodeRequest {

    private index?: number;
    private value!: { code?: number, name: string, message: string };
    protected static readonly VALUES = [
        {
            code: 5000,
            name: 'Accepted',
            message: 'Solicitud recibida con éxito',
        },
        {
            code: 5002,
            name: 'Exhausted',
            message: 'Se agotó las solicitudes de por vida: Máximo para solicitudes con los mismos parámetros',
        }
        ,
        {
            code: 5003,
            name: 'MaximumLimitReaded',
            message: 'Tope máximo: Indica que se está superando el tope máximo de CFDI o Metadata',
        },
        {
            code: 5004,
            name: 'EmptyResult',
            message: 'No se encontró la información: Indica que no generó paquetes por falta de información.',
        },
        {
            code: 5005,
            name: 'Duplicated',
            message: 'Solicitud duplicada: Si existe una solicitud vigente con los mismos parámetros',
        }
    ];

    /**
     * 
     * @param index if assign by Values.code
     */
    constructor(index: number) {
        if (typeof (index) == 'number') {
            const value = CodeRequest.VALUES.find(element => index === element.code);
            if (!value) {
                this.value = this.getEntryValueOnUndefined();
                return;
            };
            this.value = value;
            this.index = value.code;
            return;
        }
    }

    public getEntryValueOnUndefined(): { code?: number, name: string, message: string } {
        return { name: 'Unknown', message: 'Desconocida' };
    }

    public static getEntries(): { code: number, name: string, message: string }[] {
        return CodeRequest.VALUES;
    }

    public getEtryValueOnUndefined(): { name: string, message: string } {
        return { name: 'Unknown', message: 'Desconocida' };
    }

    public getEntryId(): string {
        return this.value.name;
    }

    public getMessage(): string {
        return this.value.message;
    }

    public getValue(): number | undefined {
        return this.index;
    }

    public jsonSerialize(): { value: number | undefined, message: string } {
        return {
            value: this.value.code,
            message: this.value.message
        };
    }
}

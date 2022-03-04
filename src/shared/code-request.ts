export class CodeRequest {
    protected static readonly VALUES = {
        5000: {
            name: 'Accepted',
            message: 'Solicitud recibida con éxito',
        },
        5002: {
            name: 'Exhausted',
            message: 'Se agotó las solicitudes de por vida: Máximo para solicitudes con los mismos parámetros',
        },
        5003: {
            name: 'MaximumLimitReaded',
            message: 'Tope máximo: Indica que se está superando el tope máximo de CFDI o Metadata',
        },
        5004: {
            name: 'EmptyResult',
            message: 'No se encontró la información: Indica que no generó paquetes por falta de información.',
        },
        5005: {
            name: 'Duplicated',
            message: 'Solicitud duplicada: Si existe una solicitud vigente con los mismos parámetros',
        }
    };

    public static getEntries(): {
        5000: { name: string, message: string }, 5002: { name: string, message: string }, 5003: { name: string, message: string }, 5004: { name: string, message: string }
        5005: { name: string, message: string }
    } {
        return CodeRequest.VALUES;
    }

    public getEtryValueOnUndefined(): { name: string, message: string } {
        return { name: 'Unknown', message: 'Desconocida' };
    }
}

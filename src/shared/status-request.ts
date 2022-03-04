export class StatusRequest {

    private index?: number;
    private value!: { name: string, message: string };

    protected static readonly VALUES = [
        { name: 'Accepted', message: 'Aceptada' },
        { name: 'InProgress', message: 'En proceso' },
        { name: 'Finished', message: 'Terminada' },
        { name: 'Failure', message: 'Error' },
        { name: 'Rejected', message: 'Rechazada' },
        { name: 'Expired', message: 'Vencida' },
    ];

    constructor(index: number | string) {
        if (typeof (index) == 'number') {
            if (index >= StatusRequest.VALUES.length) {
                throw new Error('Index not found');
            }
            this.index = index;
            this.value = StatusRequest.VALUES[index];
            return;
        }
        if (typeof (index) == 'string') {
            const value = StatusRequest.VALUES.find(element => index === element.name);
            if (!value) {
                this.value = this.getEntryValueOnUndefined();
                return;
            };
            this.value = value;
            this.index = StatusRequest.VALUES.indexOf(value);
            return;
        }
    }

    public static getEntriesArray(): { name: string, message: string }[] {
        return StatusRequest.VALUES;
    }

    public getEntryValueOnUndefined(): { name: string, message: string } {
        return { name: 'Unknown', message: 'Desconocida' };
    }

    public getEntryId(): string {
        return this.value.name;
    }

    public getValue(): number | undefined {
        return this.index;
    }

    public jsonSerialez(): { value: number | undefined, message: string } {
        return {
            value: this.index,
            message: this.value.message
        };
    }
}

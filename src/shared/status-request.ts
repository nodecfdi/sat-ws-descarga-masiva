export class StatusRequest {
    private index?: number;

    private value!: { code?: number; name: string; message: string };

    protected static readonly VALUES = [
        { code: 1, name: 'Accepted', message: 'Aceptada' },
        { code: 2, name: 'InProgress', message: 'En proceso' },
        { code: 3, name: 'Finished', message: 'Terminada' },
        { code: 4, name: 'Failure', message: 'Error' },
        { code: 5, name: 'Rejected', message: 'Rechazada' },
        { code: 6, name: 'Expired', message: 'Vencida' }
    ];

    /**
     *
     * @param index - if number is send assign value by array index of VALUES, values from 0 to 5 if string is send find value by Values.name
     */
    constructor(index: number | string) {
        if (typeof index == 'number') {
            const value = StatusRequest.VALUES.find((element) => index === element.code);
            if (!value) {
                this.value = this.getEntryValueOnUndefined();

                return;
            }
            this.value = value;
            this.index = value.code;
        }
        if (typeof index == 'string') {
            const value = StatusRequest.VALUES.find((element) => index === element.name);
            if (!value) {
                this.value = this.getEntryValueOnUndefined();

                return;
            }
            this.value = value;
            this.index = value.code;

            return;
        }
    }

    public static getEntriesArray(): { name: string; message: string }[] {
        return StatusRequest.VALUES;
    }

    public getEntryValueOnUndefined(): { code?: number; name: string; message: string } {
        return { name: 'Unknown', message: 'Desconocida' };
    }

    public getEntryId(): string {
        return this.value.name;
    }

    public getValue(): number | undefined {
        return this.index;
    }

    public toJSON(): { value: number | undefined; message: string } {
        return {
            value: this.index,
            message: this.value.message
        };
    }
}

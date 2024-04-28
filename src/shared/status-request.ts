export type StatusRequestTypes =
  | 'Accepted'
  | 'InProgress'
  | 'Finished'
  | 'Failure'
  | 'Rejected'
  | 'Expired';

export class StatusRequest {
  protected static readonly VALUES = [
    { code: 1, name: 'Accepted', message: 'Aceptada' },
    { code: 2, name: 'InProgress', message: 'En proceso' },
    { code: 3, name: 'Finished', message: 'Terminada' },
    { code: 4, name: 'Failure', message: 'Error' },
    { code: 5, name: 'Rejected', message: 'Rechazada' },
    { code: 6, name: 'Expired', message: 'Vencida' },
  ];

  private readonly value!: { code?: number; name: string; message: string };

  /**
   *
   * @param index - if number is send assign value by array index of VALUES, values from 0 to 5 if string is send find value by Values.name
   */
  constructor(index: number | string) {
    if (typeof index === 'number') {
      const value = StatusRequest.VALUES.find((element) => index === element.code);
      if (!value) {
        this.value = this.getEntryValueOnUndefined();

        return;
      }

      this.value = value;
    }

    if (typeof index === 'string') {
      const value = StatusRequest.VALUES.find((element) => index === element.name);
      if (!value) {
        this.value = this.getEntryValueOnUndefined();

        return;
      }

      this.value = value;
    }
  }

  public static getEntriesArray(): Array<{ name: string; message: string }> {
    return StatusRequest.VALUES;
  }

  public getEntryValueOnUndefined(): {
    code?: number;
    name: string;
    message: string;
  } {
    return { name: 'Unknown', message: 'Desconocida' };
  }

  public getEntryId(): string {
    return this.value.name;
  }

  public getValue(): number | undefined {
    return this.value.code;
  }

  public isTypeOf(type: StatusRequestTypes): boolean {
    return this.getEntryId() === type;
  }

  public toJSON(): { value: number | undefined; message: string } {
    return {
      value: this.value.code,
      message: this.value.message,
    };
  }
}

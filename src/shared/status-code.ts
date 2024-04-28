export class StatusCode {
  constructor(
    private readonly _code: number,
    private readonly _message: string,
  ) {}

  /**
   * Contains the value of "CodEstatus"
   */
  public getCode(): number {
    return this._code;
  }

  /**
   * Contains the value of "Mensaje"
   */
  public getMessage(): string {
    return this._message;
  }

  /**
   * Return true when "CodEstatus" is success
   * The only success code is "5000: Solicitud recibida con éxito"
   */
  public isAccepted(): boolean {
    return this._code === 5000;
  }

  public toJSON(): { code: number; message: string } {
    return {
      code: this._code,
      message: this._message,
    };
  }
}

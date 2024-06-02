export class Uuid {
  public constructor(private readonly _value: string) {}

  public static create(value: string): Uuid {
    const newValue = value.toLowerCase();
    // eslint-disable-next-line security/detect-unsafe-regex
    if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/.test(newValue)) {
      throw new Error('UUID does not have the correct format');
    }

    return new Uuid(newValue);
  }

  public static empty(): Uuid {
    return new Uuid('');
  }

  public static check(value: string): boolean {
    try {
      Uuid.create(value);

      return true;
    } catch {
      return false;
    }
  }

  public isEmpty(): boolean {
    return this._value === '';
  }

  public getValue(): string {
    return this._value;
  }

  public toJSON(): string {
    return this._value;
  }
}

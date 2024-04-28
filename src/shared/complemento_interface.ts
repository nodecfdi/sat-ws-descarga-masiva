export type ComplementoInterface<T> = {
  label(): string;

  value(): string;

  toJSON(): string;

  isTypeOf(type: T): boolean;
};

import { type DurationLike } from 'luxon';
import { DateTime } from '#src/shared/date-time';
import { Token } from '#src/shared/token';
import { useTestCase } from '../../test-case.js';

describe('token', () => {
  const { fileContents } = useTestCase();
  test('create token with invalid dates', () => {
    const created = DateTime.create();
    const expires = created.modify({ minutes: -1 });
    expect(() => new Token(created, expires, '')).toThrow(
      'Cannot create a token with expiration lower than creation',
    );
  });

  test('token not expired', () => {
    const created = DateTime.create();
    const expires = created.modify({ second: +5 });
    const token = new Token(created, expires, '');
    expect(token.isExpired()).toBeFalsy();
  });

  test('token expired', () => {
    const created = DateTime.create().modify({ seconds: -10 });
    const expires = created.modify({ second: +5 });
    const token = new Token(created, expires, '');
    expect(token.isExpired()).toBeTruthy();
  });

  test('value not empty', () => {
    const created = DateTime.create();
    const expires = created.modify({ second: +5 });
    const token = new Token(created, expires, 'foo');
    expect(token.isValueEmpty()).toBeFalsy();
  });

  test.each([
    [{ seconds: -10 }, { seconds: 10 }, 'foo', true],
    [{ seconds: -10 }, { seconds: -1 }, 'foo', false],
    [{ seconds: -10 }, { seconds: 10 }, '', false],
    [{ seconds: -10 }, { seconds: -1 }, '', false],
  ])(
    'is valid',
    (created: DurationLike, expires: DurationLike, value: string, expected: boolean) => {
      const token = new Token(
        DateTime.create().modify(created),
        DateTime.create().modify(expires),
        value,
      );
      expect(token.isValid()).toBe(expected);
    },
  );

  test('json', () => {
    const created = DateTime.create('2020-01-13T14:15:16-0600');
    const expires = created.modify({ second: 5 });
    const token = new Token(created, expires, 'x-value');
    const expectedFile = JSON.parse(fileContents('json/token.json')) as string;
    expect(JSON.stringify(token)).toBe(JSON.stringify(expectedFile));
  });
});

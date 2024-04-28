import { RfcMatches } from '#src/shared/rfc-matches';
import { RfcMatch } from '#src/shared/rfc-match';

describe('rfc matches', () => {
  test('object definition', () => {
    const list = RfcMatches.create();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(list.toJSON).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(list.count).toBeDefined();
    expect(Symbol.iterator in list).toBeTruthy();
  });

  test('create empty', () => {
    const list = RfcMatches.create();
    expect(list.count()).toBe(0);
    expect(list.isEmpty()).toBeTruthy();
  });

  test('create three different elements', () => {
    const items = [
      RfcMatch.create('AAA010101001'),
      RfcMatch.create('AAA010101002'),
      RfcMatch.create('AAA010101003'),
    ];
    const list = RfcMatches.create(...items);
    expect(list.count()).toBe(3);
    expect(list.itemsToArray()).toStrictEqual(items);
    expect(list.isEmpty()).toBeFalsy();
  });

  test('create with empty and repeated', () => {
    const first = RfcMatch.create('AAA010101001');
    const second = RfcMatch.create('AAA010101002');
    const items = [
      RfcMatch.empty(),
      first,
      RfcMatch.empty(),
      second,
      RfcMatch.create('AAA010101001'), // repeated
      RfcMatch.create('AAA010101001'), // repeated
      RfcMatch.create('AAA010101002'), // repeated
      RfcMatch.create('AAA010101002'), // repeated
    ];
    const list = RfcMatches.create(...items);
    expect(list.count()).toBe(2);
    expect(list.itemsToArray()).toStrictEqual([first, second]);
  });

  test('first with empty list', () => {
    const list = RfcMatches.create();
    expect(RfcMatch.empty()).toStrictEqual(list.getFirst());
  });

  test('first with populated list', () => {
    const first = RfcMatch.create('AAA010101001');
    const list = RfcMatches.create(first, RfcMatch.create('AAA010101002'));
    expect(first).toStrictEqual(list.getFirst());
  });

  test('json serialize', () => {
    const list = RfcMatches.create(
      RfcMatch.create('AAA010101001'),
      RfcMatch.create('AAA010101002'),
      RfcMatch.create('AAA010101003'),
    );
    const expectedJson = JSON.stringify(list.itemsToArray());
    expect(JSON.stringify(list)).toBe(expectedJson);
  });
});

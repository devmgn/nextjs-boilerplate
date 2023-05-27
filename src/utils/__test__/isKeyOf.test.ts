import isKeyOf from '../isKeyOf';

const ENUM_OBJECT = {
  NAME: 'John Smith',
  AGE: 30,
  EMAIL: 'john.smith@example.com',
} as const;

describe('isKeyOf', () => {
  test('正しいkeyのとき、trueが返却されること', () => {
    expect(isKeyOf(ENUM_OBJECT, 'NAME')).toBe(true);
    expect(isKeyOf(ENUM_OBJECT, 'AGE')).toBe(true);
    expect(isKeyOf(ENUM_OBJECT, 'EMAIL')).toBe(true);
  });

  test('不正なkeyのとき、falseが返却されること', () => {
    expect(isKeyOf(ENUM_OBJECT, 'invalidKey')).toBe(false);
    expect(isKeyOf(ENUM_OBJECT, 0)).toBe(false);
    expect(isKeyOf(ENUM_OBJECT, {})).toBe(false);
    expect(isKeyOf(ENUM_OBJECT, [])).toBe(false);
  });
});

import { isKeyOf } from "..";

const TEST_ENUM_OBJECT = {
  name: "John Smith",
  age: 30,
  email: "john.smith@example.com",
  10: "numbered key",
} as const;

type TestPatterns = [
  Parameters<typeof isKeyOf>[0],
  ReturnType<typeof isKeyOf>,
][];

const truthyPatterns: TestPatterns = [
  ["name", true],
  ["age", true],
  ["email", true],
  [10, true],
];

const falsyPatterns: TestPatterns = [
  ["NAME", false],
  ["AGE", false],
  ["EMAIL", false],
  [11, false],
];

const invalidPatterns: TestPatterns = [
  [{}, false],
  [[], false],
  [null, false],
  [undefined, false],
  [true, false],
  [false, false],
  [() => {}, false],
  [Symbol(""), false],
];

const testPatterns: TestPatterns = [
  ...truthyPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

describe("isKeyOf", () => {
  test.each(testPatterns)("value: %s, expected: %s", (value, expected) => {
    expect(isKeyOf(value, TEST_ENUM_OBJECT)).toBe(expected);
  });
});

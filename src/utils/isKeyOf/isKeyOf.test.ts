import { isKeyOf } from "..";

const TEST_ENUM_OBJECT = {
  NAME: "John Smith",
  AGE: 30,
  EMAIL: "john.smith@example.com",
  10: "numbered key",
} as const;

type TestPatterns = [
  Parameters<typeof isKeyOf>[0],
  ReturnType<typeof isKeyOf>,
][];

const truthyPatterns: TestPatterns = [
  ["NAME", true],
  ["AGE", true],
  ["EMAIL", true],
  [10, true],
];

const falsyPatterns: TestPatterns = [
  ["name", false],
  ["age", false],
  ["email", false],
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
  test.each(testPatterns)("value: %p, expected: %p", (value, expected) => {
    expect(isKeyOf(value, TEST_ENUM_OBJECT)).toBe(expected);
  });
});

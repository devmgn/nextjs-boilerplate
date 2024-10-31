import { isValueOf } from "..";

const TEST_ENUM_OBJECT = {
  name: "John Smith",
  age: 30,
  email: "john.smith@example.com",
  10: "numbered key",
} as const;

const TEST_ENUM_ARRAY = [
  "John Smith",
  30,
  "john.smith@example.com",
  "numbered key",
] as const;

type TestPatterns = [
  Parameters<typeof isValueOf>[0],
  Parameters<typeof isValueOf>[1],
  ReturnType<typeof isValueOf>,
][];

const truthyPatterns: TestPatterns = [
  ["John Smith", TEST_ENUM_OBJECT, true],
  [30, TEST_ENUM_OBJECT, true],
  ["john.smith@example.com", TEST_ENUM_OBJECT, true],
  ["numbered key", TEST_ENUM_OBJECT, true],
  ["John Smith", TEST_ENUM_ARRAY, true],
  [30, TEST_ENUM_ARRAY, true],
  ["john.smith@example.com", TEST_ENUM_ARRAY, true],
  ["numbered key", TEST_ENUM_ARRAY, true],
];

const falsyPatterns: TestPatterns = [
  ["name", TEST_ENUM_OBJECT, false],
  ["age", TEST_ENUM_OBJECT, false],
  ["email", TEST_ENUM_OBJECT, false],
  [11, TEST_ENUM_OBJECT, false],
  ["name", TEST_ENUM_ARRAY, false],
  ["age", TEST_ENUM_ARRAY, false],
  ["email", TEST_ENUM_ARRAY, false],
  [11, TEST_ENUM_ARRAY, false],
];

const invalidPatterns: TestPatterns = [
  [{}, TEST_ENUM_OBJECT, false],
  [[], TEST_ENUM_OBJECT, false],
  [null, TEST_ENUM_OBJECT, false],
  [undefined, TEST_ENUM_OBJECT, false],
  [true, TEST_ENUM_OBJECT, false],
  [false, TEST_ENUM_OBJECT, false],
  [() => {}, TEST_ENUM_OBJECT, false],
  [Symbol(""), TEST_ENUM_OBJECT, false],
  [{}, TEST_ENUM_ARRAY, false],
  [[], TEST_ENUM_ARRAY, false],
  [null, TEST_ENUM_ARRAY, false],
  [undefined, TEST_ENUM_ARRAY, false],
  [true, TEST_ENUM_ARRAY, false],
  [false, TEST_ENUM_ARRAY, false],
  [() => {}, TEST_ENUM_ARRAY, false],
  [Symbol(""), TEST_ENUM_ARRAY, false],
];

const testPatterns: TestPatterns = [
  ...truthyPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

describe("isValueOf", () => {
  it.each(testPatterns)(
    "value: %s, enumObject: %s, expected: %s",
    (value, enumObject, expected) => {
      expect(isValueOf(value, enumObject)).toBe(expected);
    },
  );
});

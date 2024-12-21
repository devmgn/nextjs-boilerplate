import { isValueOf } from ".";

const TEST_ENUM_OBJECT = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

type TestPatterns = [
  Parameters<typeof isValueOf>[1],
  ReturnType<typeof isValueOf>,
][];

const truthyObjectPatterns: TestPatterns = [
  ["#FF0000", true],
  ["#00FF00", true],
  ["#0000FF", true],
  ["#FFFFFF", true],
];

const falsyPatterns: TestPatterns = [
  ["name", false],
  ["age", false],
  ["email", false],
  [11, false],
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
  [{}, false],
  [[], false],
  [null, false],
  [undefined, false],
  [true, false],
  [false, false],
  [() => {}, false],
  [Symbol(""), false],
];

const TEST_ENUM_ARRAY = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"] as const;
const truthyArrayPatterns: TestPatterns = [
  ["#FF0000", true],
  ["#00FF00", true],
  ["#0000FF", true],
  ["#FFFFFF", true],
];

const testObjectPatterns: TestPatterns = [
  ...truthyObjectPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

const testArrayPattern: TestPatterns = [
  ...truthyArrayPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

describe("isValueOf", () => {
  it.each(testObjectPatterns)("value: %s, expected: %s", (value, expected) => {
    expect(isValueOf(TEST_ENUM_OBJECT, value)).toBe(expected);
  });
  it.each(testArrayPattern)("value: %s, expected: %s", (value, expected) => {
    expect(isValueOf(TEST_ENUM_ARRAY, value)).toBe(expected);
  });
});

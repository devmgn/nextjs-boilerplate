import { isValueOf } from "..";

const TEST_ENUM = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

type TestPatterns = [
  Parameters<typeof isValueOf>[1],
  ReturnType<typeof isValueOf>,
][];

const truthyPatterns: TestPatterns = [
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

const testPatterns: TestPatterns = [
  ...truthyPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

describe("isValueOf", () => {
  it.each(testPatterns)("value: %s, expected: %s", (value, expected) => {
    expect(isValueOf(TEST_ENUM, value)).toBe(expected);
  });
});

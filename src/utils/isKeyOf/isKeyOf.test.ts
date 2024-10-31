import { isKeyOf } from "..";

const TEST_ENUM = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

type TestPatterns = [
  Parameters<typeof isKeyOf>[1],
  ReturnType<typeof isKeyOf>,
][];

const truthyPatterns: TestPatterns = [
  ["red", true],
  ["green", true],
  ["blue", true],
  [1, true],
];

const falsyPatterns: TestPatterns = [
  ["NAME", false],
  ["AGE", false],
  ["EMAIL", false],
  [11, false],
];

const invalidPatterns: TestPatterns = [
  // @ts-ignore
  [{}, false],
  // @ts-ignore
  [[], false],
  // @ts-ignore
  [null, false],
  // @ts-ignore
  [undefined, false],
  // @ts-ignore
  [true, false],
  // @ts-ignore
  [false, false],
  // @ts-ignore
  [() => {}, false],
  [Symbol(""), false],
];

const testPatterns: TestPatterns = [
  ...truthyPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

describe("isKeyOf", () => {
  it.each(testPatterns)("value: %s, expected: %s", (value, expected) => {
    expect(isKeyOf(TEST_ENUM, value)).toBe(expected);
  });
});

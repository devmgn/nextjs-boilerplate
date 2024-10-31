import { safeGetValueByKey } from ".";

const TEST_ENUM = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

type TestPatterns = [
  Parameters<typeof safeGetValueByKey>[1],
  ReturnType<typeof safeGetValueByKey>,
][];

const truthyPatterns: TestPatterns = [
  ["red", "#FF0000"],
  ["green", "#00FF00"],
  ["blue", "#0000FF"],
  [1, "#FFFFFF"],
];

const falsyPatterns: TestPatterns = [
  ["NAME", undefined],
  ["AGE", undefined],
  ["EMAIL", undefined],
  [11, undefined],
];

const invalidPatterns: TestPatterns = [
  // @ts-ignore
  [{}, undefined],
  // @ts-ignore
  [[], undefined],
  // @ts-ignore
  [null, undefined],
  // @ts-ignore
  [undefined, undefined],
  // @ts-ignore
  [true, undefined],
  // @ts-ignore
  [false, undefined],
  // @ts-ignore
  [() => {}, undefined],
  [Symbol(""), undefined],
];

const testPatterns: TestPatterns = [
  ...truthyPatterns,
  ...falsyPatterns,
  ...invalidPatterns,
];

describe("safeGetValueByKey", () => {
  it.each(testPatterns)("value: %s, expected: %s", (value, expected) => {
    expect(safeGetValueByKey(TEST_ENUM, value)).toBe(expected);
  });
});

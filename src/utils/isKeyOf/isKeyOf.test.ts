import { isKeyOf } from "./isKeyOf";

const TEST_OBJECT = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

describe(isKeyOf, () => {
  describe("キーが存在する場合", () => {
    it.for([
      { value: "red", expected: true },
      { value: "green", expected: true },
      { value: "blue", expected: true },
      { value: 1, expected: true },
    ])("value: $value → $expected", ({ value, expected }) => {
      expect(isKeyOf(TEST_OBJECT, value)).toBe(expected);
    });
  });

  describe("キーが存在しない場合", () => {
    it.for([
      { value: "NAME", expected: false },
      { value: "AGE", expected: false },
      { value: 11, expected: false },
      { value: Symbol(""), expected: false },
    ])("value: $value → $expected", ({ value, expected }) => {
      expect(isKeyOf(TEST_OBJECT, value)).toBe(expected);
    });
  });
});

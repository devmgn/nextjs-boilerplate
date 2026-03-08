import { isValueOf } from "./isValueOf";

const TEST_OBJECT = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

const TEST_ARRAY = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"] as const;

const falsyCases = [
  { value: "name" },
  { value: "age" },
  { value: 11 },
  { value: {} },
  { value: [] },
  { value: null },
  { value: undefined },
  { value: true },
  { value: false },
  { value: () => {} },
  { value: Symbol("") },
];

describe(isValueOf, () => {
  describe("オブジェクト", () => {
    describe("値が存在する場合", () => {
      it.for([
        { value: "#FF0000" },
        { value: "#00FF00" },
        { value: "#0000FF" },
        { value: "#FFFFFF" },
      ])("value: $value → true", ({ value }) => {
        expect(isValueOf(TEST_OBJECT, value)).toBe(true);
      });
    });

    describe("値が存在しない場合", () => {
      it.for(falsyCases)("value: $value → false", ({ value }) => {
        expect(isValueOf(TEST_OBJECT, value)).toBe(false);
      });
    });
  });

  describe("配列", () => {
    describe("値が存在する場合", () => {
      it.for([
        { value: "#FF0000" },
        { value: "#00FF00" },
        { value: "#0000FF" },
        { value: "#FFFFFF" },
      ])("value: $value → true", ({ value }) => {
        expect(isValueOf(TEST_ARRAY, value)).toBe(true);
      });
    });

    describe("値が存在しない場合", () => {
      it.for(falsyCases)("value: $value → false", ({ value }) => {
        expect(isValueOf(TEST_ARRAY, value)).toBe(false);
      });
    });
  });
});

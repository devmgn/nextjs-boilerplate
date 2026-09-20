import { describe, expect, it } from "vitest";
import { isValueOf } from "./is-value-of";

const TEST_OBJECT = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  1: "#FFFFFF",
} as const;

const TEST_ARRAY = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"] as const;

const falsyCases: { value?: unknown }[] = [
  { value: "name" },
  { value: "age" },
  { value: 11 },
  { value: {} },
  { value: [] },
  { value: null },
  // value を持たせないことで undefined を表す
  {},
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
        expect(isValueOf(TEST_OBJECT, value)).toBeTruthy();
      });
    });

    describe("値が存在しない場合", () => {
      it.for(falsyCases)("value: $value → false", ({ value }) => {
        expect(isValueOf(TEST_OBJECT, value)).toBeFalsy();
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
        expect(isValueOf(TEST_ARRAY, value)).toBeTruthy();
      });
    });

    describe("値が存在しない場合", () => {
      it.for(falsyCases)("value: $value → false", ({ value }) => {
        expect(isValueOf(TEST_ARRAY, value)).toBeFalsy();
      });
    });
  });
});

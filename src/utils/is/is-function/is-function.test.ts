import { describe, expect, it } from "vitest";
import { isFunction } from "./is-function";

function noop() {}

function returnX() {
  return "x";
}

describe(isFunction, () => {
  describe("関数の場合", () => {
    it.for([
      { label: "function declaration", input: noop },
      { label: "built-in function", input: Math.max },
    ])("$label → true", ({ input }) => {
      expect(isFunction(input)).toBeTruthy();
    });
  });

  describe("関数でない場合", () => {
    it.for<{ label: string; input?: unknown }>([
      { label: "string", input: "x" },
      { label: "number", input: 42 },
      { label: "boolean", input: true },
      { label: "null", input: null },
      // input を持たせないことで undefined を表す
      { label: "undefined" },
      { label: "object", input: {} },
      { label: "array", input: [] },
    ])("$label → false", ({ input }) => {
      expect(isFunction(input)).toBeFalsy();
    });
  });

  // narrowing そのものは型の挙動なので is-function.test-d.ts で検証する。
  // ここでは実行時に true を返すことだけを見る。
  it("ユニオン型の関数成分を true と判定する", () => {
    const union: string | (() => string) = returnX;

    expect(isFunction(union)).toBeTruthy();
  });
});

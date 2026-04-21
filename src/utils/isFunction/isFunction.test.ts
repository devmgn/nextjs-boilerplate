import { isFunction } from "./isFunction";

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
      expect(isFunction(input)).toBe(true);
    });
  });

  describe("関数でない場合", () => {
    it.for([
      { label: "string", input: "x" },
      { label: "number", input: 42 },
      { label: "boolean", input: true },
      { label: "null", input: null },
      { label: "undefined", input: undefined },
      { label: "object", input: {} },
      { label: "array", input: [] },
    ])("$label → false", ({ input }) => {
      expect(isFunction(input)).toBe(false);
    });
  });

  // 型述語の narrowing 挙動そのものがテスト対象のため、各ブランチで expect する
  it("ユニオン型を関数成分で narrow する", () => {
    const union: string | (() => string) = returnX;
    // oxlint-disable jest/no-conditional-in-test,jest/no-conditional-expect
    if (isFunction(union)) {
      expect(union()).toBe("x");
    } else {
      expect.unreachable();
    }
    // oxlint-enable jest/no-conditional-in-test,jest/no-conditional-expect
  });
});

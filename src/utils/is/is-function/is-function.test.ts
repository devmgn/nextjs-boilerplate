import { describe, expect, it } from "vitest";
import { isFunction } from "./is-function";

function noop() {}

function returnX() {
  return "x";
}

describe(isFunction, () => {
  describe("when it is a function", () => {
    it.for([
      { label: "function declaration", input: noop },
      { label: "built-in function", input: Math.max },
    ])("$label → true", ({ input }) => {
      expect(isFunction(input)).toBeTruthy();
    });
  });

  describe("when it is not a function", () => {
    it.for<{ label: string; input?: unknown }>([
      { label: "string", input: "x" },
      { label: "number", input: 42 },
      { label: "boolean", input: true },
      { label: "null", input: null },
      // Omitting input represents undefined
      { label: "undefined" },
      { label: "object", input: {} },
      { label: "array", input: [] },
    ])("$label → false", ({ input }) => {
      expect(isFunction(input)).toBeFalsy();
    });
  });

  // Narrowing itself is type-level behavior, so it is tested in is-function.test-d.ts.
  // Here we only check that it returns true at runtime.
  it("returns true for the function member of a union", () => {
    const union: string | (() => string) = returnX;

    expect(isFunction(union)).toBeTruthy();
  });
});

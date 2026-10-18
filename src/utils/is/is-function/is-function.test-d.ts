import { describe, expectTypeOf, it } from "vitest";
import { isFunction } from "./is-function";

// Build the union from a declared return type so the initializer does not narrow it.
function makeUnion(): string | (() => string) {
  return "x";
}

describe(isFunction, () => {
  it("narrows a union into its function and non-function members", () => {
    const union = makeUnion();

    if (isFunction(union)) {
      expectTypeOf(union).toEqualTypeOf<() => string>();
    } else {
      expectTypeOf(union).toEqualTypeOf<string>();
    }
  });
});

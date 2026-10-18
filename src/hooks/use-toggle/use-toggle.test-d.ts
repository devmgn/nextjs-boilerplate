import { describe, expectTypeOf, it } from "vitest";
import { useToggle } from "./use-toggle";

/** Set of values used to test the array argument. */
type Theme = "light" | "dark" | "system";

// Overload resolution can only be observed from an actual call expression, so these
// type-test wrappers also call useToggle. A function that calls a hook is itself a custom hook,
// so they use the `use` prefix to satisfy the Rules of Hooks.
// None of them run at runtime; they exist only for tsc type checking.

function useNoArg() {
  const [value, toggle] = useToggle();
  expectTypeOf(value).toEqualTypeOf<boolean>();
  expectTypeOf(toggle).parameter(0).toEqualTypeOf<boolean | undefined>();
}

function useBooleanArg() {
  const [value] = useToggle(true);
  expectTypeOf(value).toEqualTypeOf<boolean>();
}

function useArrayArg() {
  const [value, toggle] = useToggle(["light", "dark", "system"]);
  expectTypeOf(value).toEqualTypeOf<Theme>();
  expectTypeOf(toggle).parameter(0).toEqualTypeOf<Theme | undefined>();
}

function useArrayWithInitial() {
  const [value] = useToggle(["light", "dark", "system"], "dark");
  expectTypeOf(value).toEqualTypeOf<Theme>();
}

describe("useToggle type inference", () => {
  it("value is boolean with no arguments", () => {
    expectTypeOf(useNoArg).toBeFunction();
  });

  it("value is boolean when a boolean is passed", () => {
    expectTypeOf(useBooleanArg).toBeFunction();
  });

  it("value is inferred as the union of elements when an array literal is passed", () => {
    expectTypeOf(useArrayArg).toBeFunction();
  });

  it("value is the union of elements when an array and initial value are passed", () => {
    expectTypeOf(useArrayWithInitial).toBeFunction();
  });
});

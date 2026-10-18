import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useToggle } from "./use-toggle";

describe(useToggle, () => {
  describe("boolean mode", () => {
    it("defaults to false with no arguments", () => {
      const { result } = renderHook(() => useToggle());
      const [value] = result.current;
      expect(value).toBeFalsy();
    });

    it("starts as true when the initial value is true", () => {
      const { result } = renderHook(() => useToggle(true));
      expect(result.current[0]).toBeTruthy();
    });

    it("starts as false when the initial value is explicitly false", () => {
      const { result } = renderHook(() => useToggle(false));
      expect(result.current[0]).toBeFalsy();
    });

    it("toggle() inverts the value", () => {
      const { result } = renderHook(() => useToggle());
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBeTruthy();
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBeFalsy();
    });

    it("toggle(value) sets the value directly", () => {
      const { result } = renderHook(() => useToggle());
      act(() => {
        result.current[1](true);
      });
      expect(result.current[0]).toBeTruthy();
      act(() => {
        result.current[1](true);
      });
      expect(result.current[0]).toBeTruthy();
      act(() => {
        result.current[1](false);
      });
      expect(result.current[0]).toBeFalsy();
    });
  });

  describe("array mode", () => {
    it("starts with the first element when an array is passed", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"])
      );

      expect(result.current[0]).toBe("light");
    });

    it("starts with the value given as the second argument", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"], "dark")
      );

      expect(result.current[0]).toBe("dark");
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("system");
    });

    it("toggle(value) sets the value directly", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"])
      );

      act(() => {
        result.current[1]("dark");
      });
      expect(result.current[0]).toBe("dark");
      act(() => {
        result.current[1]("system");
      });
      expect(result.current[0]).toBe("system");
    });

    it("keeps the value when toggle(value) is called repeatedly with the same value", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"])
      );

      act(() => {
        result.current[1]("dark");
      });
      expect(result.current[0]).toBe("dark");
      act(() => {
        result.current[1]("dark");
      });
      expect(result.current[0]).toBe("dark");
    });

    it("toggle() advances to the element after the one set by toggle(value)", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"])
      );

      act(() => {
        result.current[1]("dark");
      });
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("system");
    });

    it("toggle() advances to the next element and wraps around from the last", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"])
      );

      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("dark");
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("system");
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("light");
    });
  });

  describe("invalid arguments", () => {
    it("throws when an empty array is passed", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => renderHook(() => useToggle([]))).toThrow(
        /must be a non-empty array/u
      );
    });

    it("throws when initialValue is not in the array", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        renderHook(() => useToggle<string>(["light", "dark"], "system"))
      ).toThrow(/initialValue must be one of the values/u);
    });
  });
});

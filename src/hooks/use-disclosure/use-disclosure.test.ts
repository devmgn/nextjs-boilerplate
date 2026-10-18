import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDisclosure } from "./use-disclosure";

describe(useDisclosure, () => {
  describe("initialization", () => {
    it("initializes isOpen to false when the argument is omitted", () => {
      const { result } = renderHook(() => useDisclosure());
      expect(result.current.isOpen).toBeFalsy();
    });

    it("initializes isOpen to true when initialState is true", () => {
      const { result } = renderHook(() => useDisclosure(true));
      expect(result.current.isOpen).toBeTruthy();
    });

    it("initializes isOpen to false when initialState is false", () => {
      const { result } = renderHook(() => useDisclosure(false));
      expect(result.current.isOpen).toBeFalsy();
    });
  });

  describe("open()", () => {
    it("open() sets isOpen to true when it is false", () => {
      const { result } = renderHook(() => useDisclosure(false));
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBeTruthy();
    });

    it("open() keeps isOpen true when it is already true", () => {
      const { result } = renderHook(() => useDisclosure(true));
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBeTruthy();
    });
  });

  describe("close()", () => {
    it("close() sets isOpen to false when it is true", () => {
      const { result } = renderHook(() => useDisclosure(true));
      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBeFalsy();
    });

    it("close() keeps isOpen false when it is already false", () => {
      const { result } = renderHook(() => useDisclosure(false));
      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBeFalsy();
    });
  });

  describe("toggle()", () => {
    it("toggle() sets isOpen to true when it is false", () => {
      const { result } = renderHook(() => useDisclosure(false));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBeTruthy();
    });

    it("toggle() sets isOpen to false when it is true", () => {
      const { result } = renderHook(() => useDisclosure(true));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBeFalsy();
    });
  });

  describe("combined scenarios", () => {
    it("tracks state correctly through open, close, then toggle on the same instance", () => {
      const { result } = renderHook(() => useDisclosure());
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBeTruthy();
      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBeFalsy();
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBeTruthy();
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBeFalsy();
    });
  });
});

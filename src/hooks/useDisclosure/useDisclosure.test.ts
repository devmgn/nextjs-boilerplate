import { act, renderHook } from "@testing-library/react";
import { useDisclosure } from "./useDisclosure";

describe(useDisclosure, () => {
  describe("初期化", () => {
    it("引数を省略したとき、isOpen は false で初期化されること", () => {
      const { result } = renderHook(() => useDisclosure());
      expect(result.current.isOpen).toBe(false);
    });

    it("initialState に true を渡したとき、isOpen は true で初期化されること", () => {
      const { result } = renderHook(() => useDisclosure(true));
      expect(result.current.isOpen).toBe(true);
    });

    it("initialState に false を渡したとき、isOpen は false で初期化されること", () => {
      const { result } = renderHook(() => useDisclosure(false));
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("open()", () => {
    it("isOpen が false のとき、open() を呼ぶと true になること", () => {
      const { result } = renderHook(() => useDisclosure(false));
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it("isOpen が true のとき、open() を呼んでも true のままであること", () => {
      const { result } = renderHook(() => useDisclosure(true));
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("close()", () => {
    it("isOpen が true のとき、close() を呼ぶと false になること", () => {
      const { result } = renderHook(() => useDisclosure(true));
      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it("isOpen が false のとき、close() を呼んでも false のままであること", () => {
      const { result } = renderHook(() => useDisclosure(false));
      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("toggle()", () => {
    it("isOpen が false のとき、toggle() を呼ぶと true になること", () => {
      const { result } = renderHook(() => useDisclosure(false));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it("isOpen が true のとき、toggle() を呼ぶと false になること", () => {
      const { result } = renderHook(() => useDisclosure(true));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("複合シナリオ", () => {
    it("同一インスタンスで open → close → toggle を連続して呼んでも、状態が正しく追従すること", () => {
      const { result } = renderHook(() => useDisclosure());
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });
});

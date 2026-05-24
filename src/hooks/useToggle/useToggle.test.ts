import { act, renderHook } from "@testing-library/react";
import { useToggle } from "./useToggle";

describe(useToggle, () => {
  describe("boolean モード", () => {
    it("引数なしで呼んだとき、初期値は false となること", () => {
      const { result } = renderHook(() => useToggle());
      const [value] = result.current;
      expect(value).toBe(false);
    });

    it("初期値に true を指定したとき、初期値は true となること", () => {
      const { result } = renderHook(() => useToggle(true));
      expect(result.current[0]).toBe(true);
    });

    it("初期値に false を明示的に指定したとき、初期値は false となること", () => {
      const { result } = renderHook(() => useToggle(false));
      expect(result.current[0]).toBe(false);
    });

    it("toggle() を呼ぶと値が反転すること", () => {
      const { result } = renderHook(() => useToggle());
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(true);
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(false);
    });

    it("toggle(value) に値を渡すと、その値が直接セットされること", () => {
      const { result } = renderHook(() => useToggle());
      act(() => {
        result.current[1](true);
      });
      expect(result.current[0]).toBe(true);
      act(() => {
        result.current[1](true);
      });
      expect(result.current[0]).toBe(true);
      act(() => {
        result.current[1](false);
      });
      expect(result.current[0]).toBe(false);
    });
  });

  describe("配列モード", () => {
    it("配列を渡したとき、初期値は先頭要素となること", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"]),
      );
      expect(result.current[0]).toBe("light");
    });

    it("第2引数で初期値を指定したとき、その値が初期値となること", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"], "dark"),
      );
      expect(result.current[0]).toBe("dark");
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("system");
    });

    it("toggle(value) に値を渡すと、その値が直接セットされること", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"]),
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

    it("toggle(value) を同じ値で複数回呼んでも、その値のままであること", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"]),
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

    it("toggle(value) でセットした後、toggle() を呼ぶと、その値の次の要素へ進むこと", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"]),
      );
      act(() => {
        result.current[1]("dark");
      });
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe("system");
    });

    it("toggle() を呼ぶと次の要素に進み、末尾なら先頭へ循環すること", () => {
      const { result } = renderHook(() =>
        useToggle(["light", "dark", "system"]),
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

  describe("不正な引数", () => {
    it("空配列を渡したとき、エラーを投げること", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => renderHook(() => useToggle([]))).toThrow(
        /must be a non-empty array/u,
      );
    });

    it("配列に含まれない値を initialValue に渡したとき、エラーを投げること", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        renderHook(() => useToggle(["light", "dark"], "system" as "light")),
      ).toThrow(/initialValue must be one of the values/u);
    });
  });
});

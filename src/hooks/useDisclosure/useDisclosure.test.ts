import { act, renderHook } from "@testing-library/react";
import { useDisclosure } from ".";

describe("useDisclosure", () => {
  it("initialStateを指定しないとき、初期状態でisOpenはfalseとなること", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("initialStateをtrueに設定したとき、初期状態でisOpenはtrueとなること", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it("open関数を呼び出したとき、isOpenはtrueとなること", () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it("close関数を呼び出したとき、isOpenはfalseとなること", () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it("toggle関数を呼び出したとき、isOpenの状態が反転すること", () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });
});

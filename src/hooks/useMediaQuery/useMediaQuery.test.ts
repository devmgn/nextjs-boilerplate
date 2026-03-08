import { act, renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

const QUERY = "(min-width: 768px)";

function createMockMediaQueryList(matches: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | null = null;
  return {
    matches,
    addEventListener(
      _event: string,
      handler: (event: MediaQueryListEvent) => void,
    ) {
      listener = handler;
    },
    removeEventListener(
      _event: string,
      handler: (event: MediaQueryListEvent) => void,
    ) {
      if (listener === handler) {
        listener = null;
      }
    },
    fire(newMatches: boolean) {
      this.matches = newMatches;
      const event = {
        matches: newMatches,
        media: "",
      } as unknown as MediaQueryListEvent;
      listener?.(event);
    },
    get hasListener() {
      return listener !== null;
    },
  };
}

describe(useMediaQuery, () => {
  let mockMql: ReturnType<typeof createMockMediaQueryList>;
  let matchMediaSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockMql = createMockMediaQueryList(false);
    matchMediaSpy = vi.fn().mockReturnValue(mockMql);
    vi.stubGlobal("matchMedia", matchMediaSpy);
  });

  it("クエリが一致しないとき、falseを返すこと", () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBe(false);
  });

  it("クエリが一致するとき、trueを返すこと", () => {
    mockMql.matches = true;
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBe(true);
  });

  it("matchMediaに正しいクエリ文字列が渡されること", () => {
    renderHook(() => useMediaQuery(QUERY));
    expect(matchMediaSpy).toHaveBeenCalledWith(QUERY);
  });

  it("メディアクエリの変更を検知して値が更新されること", () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBe(false);

    act(() => {
      mockMql.fire(true);
    });
    expect(result.current).toBe(true);

    act(() => {
      mockMql.fire(false);
    });
    expect(result.current).toBe(false);
  });

  it("メディアクエリの変更時にonChangeコールバックがイベントと共に呼ばれること", () => {
    const onChange = vi.fn();
    renderHook(() => useMediaQuery(QUERY, onChange));

    act(() => {
      mockMql.fire(true);
    });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ matches: true }),
    );
  });

  it("onChangeが未指定でもエラーにならないこと", () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));

    expect(() => {
      act(() => {
        mockMql.fire(true);
      });
    }).not.toThrow();
    expect(result.current).toBe(true);
  });

  it("queryが変わったときにリスナーが再登録されること", () => {
    const newMql = createMockMediaQueryList(true);

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: QUERY },
    });
    expect(mockMql.hasListener).toBe(true);

    matchMediaSpy.mockReturnValue(newMql);
    rerender({ query: "(min-width: 1024px)" });

    expect(mockMql.hasListener).toBe(false);
    expect(newMql.hasListener).toBe(true);
  });

  it("アンマウント時にイベントリスナーが解除されること", () => {
    const { unmount } = renderHook(() => useMediaQuery(QUERY));
    expect(mockMql.hasListener).toBe(true);

    unmount();
    expect(mockMql.hasListener).toBe(false);
  });
});

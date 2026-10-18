import type { Mock } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

const QUERY = "(min-width: 768px)";

function createMockMediaQueryList(matches: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | null = null;

  return {
    matches,
    addEventListener(
      _event: string,
      handler: (event: MediaQueryListEvent) => void
    ) {
      listener = handler;
    },
    removeEventListener(
      _event: string,
      handler: (event: MediaQueryListEvent) => void
    ) {
      if (listener === handler) {
        listener = null;
      }
    },
    fire(newMatches: boolean) {
      this.matches = newMatches;

      const event = new MediaQueryListEvent("change", {
        matches: newMatches,
        media: "",
      });

      listener?.(event);
    },
    get hasListener() {
      return listener !== null;
    },
  };
}

describe(useMediaQuery, () => {
  let mockMql: ReturnType<typeof createMockMediaQueryList>;

  let matchMediaSpy: Mock<
    (query: string) => ReturnType<typeof createMockMediaQueryList>
  >;

  beforeEach(() => {
    mockMql = createMockMediaQueryList(false);
    matchMediaSpy = vi
      .fn<(query: string) => ReturnType<typeof createMockMediaQueryList>>()
      .mockReturnValue(mockMql);
    vi.stubGlobal("matchMedia", matchMediaSpy);
  });

  it("returns false when the query does not match", () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBeFalsy();
  });

  it("returns true when the query matches", () => {
    mockMql.matches = true;
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBeTruthy();
  });

  it("passes the query string to matchMedia", () => {
    renderHook(() => useMediaQuery(QUERY));
    expect(matchMediaSpy).toHaveBeenCalledWith(QUERY);
  });

  it("updates the value when the media query changes", () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBeFalsy();

    act(() => {
      mockMql.fire(true);
    });
    expect(result.current).toBeTruthy();

    act(() => {
      mockMql.fire(false);
    });
    expect(result.current).toBeFalsy();
  });

  it("calls onChange with the event when the media query changes", () => {
    const onChange = vi.fn<(event: MediaQueryListEvent) => void>();
    renderHook(() => useMediaQuery(QUERY, onChange));

    act(() => {
      mockMql.fire(true);
    });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ matches: true })
    );
  });

  it("does not throw when onChange is omitted", () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));

    expect(() => {
      act(() => {
        mockMql.fire(true);
      });
    }).not.toThrow();
    expect(result.current).toBeTruthy();
  });

  it("re-registers the listener when query changes", () => {
    const newMql = createMockMediaQueryList(true);

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: QUERY },
    });

    expect(mockMql.hasListener).toBeTruthy();

    vi.when(matchMediaSpy).calledWith("(min-width: 1024px)").thenReturn(newMql);
    rerender({ query: "(min-width: 1024px)" });

    expect(mockMql.hasListener).toBeFalsy();
    expect(newMql.hasListener).toBeTruthy();
  });

  it("removes the event listener on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery(QUERY));
    expect(mockMql.hasListener).toBeTruthy();

    unmount();
    expect(mockMql.hasListener).toBeFalsy();
  });
});

import { useQueryClient } from "@tanstack/react-query";
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClientProvider } from "./query-client-provider";
import { getQueryClient } from "../../lib/get-query-client";

// ReactQueryDevtools は本番・テスト環境では何も描画しないため、
// レンダリングを検証するテストは置かない。

describe(QueryClientProvider, () => {
  it("childrenをレンダリングすること", () => {
    render(
      <QueryClientProvider>
        <span data-testid="child">hello</span>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("子コンポーネントからuseQueryClientでgetQueryClientと同一のインスタンスが取得できること", () => {
    const expected = getQueryClient();

    const { result } = renderHook(() => useQueryClient(), {
      wrapper: ({ children }) => (
        <QueryClientProvider>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toBe(expected);
  });
});

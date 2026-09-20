import { useQueryClient } from "@tanstack/react-query";
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClientProvider } from "./query-client-provider";
import { getQueryClient } from "../../lib/get-query-client";

// NOTE: ReactQueryDevtools は本番・テスト環境では何も描画しないため、
// 「描画されること」を実物で検証する手段がない。モックを注入して
// そのモックが出ることを確かめるだけのテストは意味がないので置かない。

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

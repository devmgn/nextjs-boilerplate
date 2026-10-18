import { useQueryClient } from "@tanstack/react-query";
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClientProvider } from "./query-client-provider";
import { getQueryClient } from "../../lib/get-query-client";

// ReactQueryDevtools renders nothing in production and test environments,
// so there is no test for its rendering.

describe(QueryClientProvider, () => {
  it("renders children", () => {
    render(
      <QueryClientProvider>
        <span data-testid="child">hello</span>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("exposes the same instance as getQueryClient via useQueryClient", () => {
    const expected = getQueryClient();

    const { result } = renderHook(() => useQueryClient(), {
      wrapper: ({ children }) => (
        <QueryClientProvider>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toBe(expected);
  });
});

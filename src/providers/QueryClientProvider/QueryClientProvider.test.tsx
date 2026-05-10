import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "./QueryClientProvider";
import { getQueryClient } from "../../lib/getQueryClient";

vi.mock(import("@tanstack/react-query-devtools"), () => ({
  ReactQueryDevtools: () => <div data-testid="devtools" />,
}));

describe(QueryClientProvider, () => {
  it("childrenをレンダリングすること", () => {
    render(
      <QueryClientProvider>
        <span data-testid="child">hello</span>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("ReactQueryDevtoolsをレンダリングすること", () => {
    render(
      <QueryClientProvider>
        <span />
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("devtools")).toBeInTheDocument();
  });

  it("子コンポーネントからuseQueryClientでgetQueryClientと同一のインスタンスが取得できること", () => {
    const expected = getQueryClient();
    let received: unknown;

    function Probe() {
      received = useQueryClient();
      return null;
    }

    render(
      <QueryClientProvider>
        <Probe />
      </QueryClientProvider>,
    );

    expect(received).toBe(expected);
  });
});

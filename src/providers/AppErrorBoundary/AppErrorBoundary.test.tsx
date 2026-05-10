import { fireEvent, render, screen } from "@testing-library/react";
import { AppErrorBoundary } from "./AppErrorBoundary";

function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("boom");
  }
  return <div data-testid="ok">ok</div>;
}

describe(AppErrorBoundary, () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("childrenがエラーを投げないとき、childrenをそのままレンダリングすること", () => {
    render(
      <AppErrorBoundary>
        <Thrower shouldThrow={false} />
      </AppErrorBoundary>,
    );

    expect(screen.getByTestId("ok")).toHaveTextContent("ok");
  });

  it("childrenがエラーを投げたとき、ErrorPageをフォールバック表示すること", () => {
    render(
      <AppErrorBoundary>
        <Thrower shouldThrow />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong!" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  it("Try againボタンを押すと、エラー状態がリセットされchildrenが再レンダリングされること", () => {
    const { rerender } = render(
      <AppErrorBoundary>
        <Thrower shouldThrow />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong!" }),
    ).toBeInTheDocument();

    rerender(
      <AppErrorBoundary>
        <Thrower shouldThrow={false} />
      </AppErrorBoundary>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByTestId("ok")).toHaveTextContent("ok");
  });
});

import { fireEvent, render } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedInput } from "./use-debounced-input";

function Probe({
  onValue,
  wait,
  multiline = false,
}: {
  onValue: (value: string) => void;
  wait: number;
  multiline?: boolean;
}) {
  const handlers = useDebouncedInput(onValue, wait);

  // Also guarantee at the type level that the same handlers can be spread onto both input and textarea
  if (multiline) {
    return <textarea data-testid="textarea" {...handlers} />;
  }

  return <input data-testid="input" {...handlers} />;
}

describe(useDebouncedInput, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("debounces the input value and passes it to onValue", () => {
    const onValue = vi.fn<(value: string) => void>();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);

    fireEvent.change(getByTestId("input"), { target: { value: "a" } });
    expect(onValue).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("a");
  });

  it("runs once with the last value on rapid input", () => {
    const onValue = vi.fn<(value: string) => void>();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);
    const input = getByTestId("input");

    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.change(input, { target: { value: "abc" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("abc");
  });

  it("does not forward input during IME composition (after compositionStart) to debounce", () => {
    const onValue = vi.fn<(value: string) => void>();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);
    const input = getByTestId("input");

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "ねこ" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).not.toHaveBeenCalled();
  });

  it("applies the committed value immediately on compositionEnd", () => {
    const onValue = vi.fn<(value: string) => void>();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);
    const input = getByTestId("input");

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "ねこ" } });
    fireEvent.compositionEnd(input, { target: { value: "猫" } });

    // flush runs it immediately without waiting for the timer
    expect(onValue).toHaveBeenCalledExactlyOnceWith("猫");
  });

  it("debounces normal input again after composition is committed", () => {
    const onValue = vi.fn<(value: string) => void>();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);
    const input = getByTestId("input");

    fireEvent.compositionStart(input);
    fireEvent.compositionEnd(input, { target: { value: "猫" } });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("猫");

    fireEvent.change(input, { target: { value: "猫です" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledTimes(2);
    expect(onValue).toHaveBeenNthCalledWith(2, "猫です");
  });

  it("keeps the pending timer on re-render with unchanged deps", () => {
    const onValue = vi.fn<(value: string) => void>();

    const { getByTestId, rerender } = render(
      <Probe onValue={onValue} wait={300} />
    );

    fireEvent.change(getByTestId("input"), { target: { value: "a" } });
    // Re-render with the same deps (memoization cache-hit path)
    rerender(<Probe onValue={onValue} wait={300} />);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("a");
  });

  it("can be spread onto a textarea and debounces", () => {
    const onValue = vi.fn<(value: string) => void>();

    const { getByTestId } = render(
      <Probe multiline onValue={onValue} wait={300} />
    );

    fireEvent.change(getByTestId("textarea"), {
      target: { value: "multi\nline" },
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("multi\nline");
  });

  it("recreates the timer when wait changes", () => {
    const onValue = vi.fn<(value: string) => void>();

    const { getByTestId, rerender } = render(
      <Probe onValue={onValue} wait={300} />
    );

    fireEvent.change(getByTestId("input"), { target: { value: "a" } });
    // Change wait (memoization cache-miss path): the old timer is discarded
    rerender(<Probe onValue={onValue} wait={500} />);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).not.toHaveBeenCalled();

    fireEvent.change(getByTestId("input"), { target: { value: "b" } });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("b");
  });
});

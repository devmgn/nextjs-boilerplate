import { fireEvent, render } from "@testing-library/react";
import { act } from "react";
import { useDebouncedInput } from "./useDebouncedInput";

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
  // input / textarea どちらにも同じ handlers をスプレッドできることを型でも保証する
  return multiline ? (
    <textarea data-testid="textarea" {...handlers} />
  ) : (
    <input data-testid="input" {...handlers} />
  );
}

describe(useDebouncedInput, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("入力値が debounce されて onValue に渡ること", () => {
    const onValue = vi.fn();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);

    fireEvent.change(getByTestId("input"), { target: { value: "a" } });
    expect(onValue).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("a");
  });

  it("連続入力では最後の値で1回だけ実行されること", () => {
    const onValue = vi.fn();
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

  it("IME 変換中 (compositionStart 後) の入力は debounce に流れないこと", () => {
    const onValue = vi.fn();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);
    const input = getByTestId("input");

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "ねこ" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).not.toHaveBeenCalled();
  });

  it("変換確定 (compositionEnd) で確定値が即時に反映されること", () => {
    const onValue = vi.fn();
    const { getByTestId } = render(<Probe onValue={onValue} wait={300} />);
    const input = getByTestId("input");

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "ねこ" } });
    fireEvent.compositionEnd(input, { target: { value: "猫" } });

    // flush によりタイマー待ちなしで即時実行される
    expect(onValue).toHaveBeenCalledExactlyOnceWith("猫");
  });

  it("変換確定後の通常入力は再び debounce されること", () => {
    const onValue = vi.fn();
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

  it("依存が変わらない再レンダリングでも保留中のタイマーが失われないこと", () => {
    const onValue = vi.fn();
    const { getByTestId, rerender } = render(
      <Probe onValue={onValue} wait={300} />,
    );

    fireEvent.change(getByTestId("input"), { target: { value: "a" } });
    // 同一 deps で再レンダリング（メモ化のキャッシュヒット経路）
    rerender(<Probe onValue={onValue} wait={300} />);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("a");
  });

  it("textarea にもスプレッドでき debounce されること", () => {
    const onValue = vi.fn();
    const { getByTestId } = render(
      <Probe multiline onValue={onValue} wait={300} />,
    );

    fireEvent.change(getByTestId("textarea"), {
      target: { value: "multi\nline" },
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onValue).toHaveBeenCalledExactlyOnceWith("multi\nline");
  });

  it("wait を変更するとタイマーが作り直されること", () => {
    const onValue = vi.fn();
    const { getByTestId, rerender } = render(
      <Probe onValue={onValue} wait={300} />,
    );

    fireEvent.change(getByTestId("input"), { target: { value: "a" } });
    // wait 変更（メモ化のキャッシュミス経路）→ 旧タイマーは破棄される
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

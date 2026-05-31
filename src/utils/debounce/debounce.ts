interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** 保留中のタイマーをクリアし、内部状態をリセットする。 */
  cancel: () => void;
  /** 保留中のコールバックを即時実行する。保留がなければ何もしない。 */
  flush: () => void;
}

function assertNonNegativeFinite(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(
      `debounce: \`${name}\` must be a finite non-negative number, got ${value}.`,
    );
  }
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number,
): DebouncedFunction<Args> {
  assertNonNegativeFinite("wait", wait);

  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastArgs: Args | undefined = undefined;

  // func 実行前に内部状態をクリアする。これにより:
  // - 再帰: func 内から debounced() を呼んでも保持中の引数を上書きしない
  // - 例外復旧: func が throw しても timerId/lastArgs はクリア済みで次サイクルが動く
  function run(args: Args) {
    timerId = undefined;
    lastArgs = undefined;
    func(...args);
  }

  // clearTimeout は undefined を渡しても no-op なので、timerId の有無を分岐しない。
  function cancel() {
    clearTimeout(timerId);
    timerId = undefined;
    lastArgs = undefined;
  }

  function flush() {
    if (lastArgs === undefined) {
      return;
    }
    clearTimeout(timerId);
    run(lastArgs);
  }

  function debounced(...args: Args): void {
    lastArgs = args;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      run(args);
    }, wait);
  }

  return Object.assign(debounced, { cancel, flush });
}

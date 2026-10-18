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
      `debounce: \`${name}\` must be a finite non-negative number, got ${value}.`
    );
  }
}

/**
 * タイマー未設定を null で表すため、clearTimeout の呼び分けをここに閉じ込める。
 *
 * @param id - クリアするタイマー ID。未設定なら `null`
 */
function clearTimer(id: ReturnType<typeof setTimeout> | null): void {
  if (id !== null) {
    clearTimeout(id);
  }
}

/**
 * 最後の呼び出しから `wait` ミリ秒経過するまで `func` の実行を遅延させる関数を生成する。
 *
 * @param func - 遅延実行する関数
 * @param wait - 遅延時間 (ミリ秒)。有限の非負数でなければ `TypeError` を throw する
 * @returns `cancel` / `flush` を持つ debounce 済み関数
 */
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): DebouncedFunction<Args> {
  assertNonNegativeFinite("wait", wait);

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args | null = null;

  // func 実行前に内部状態をクリアする。これにより:
  // - 再帰: func 内から debounced() を呼んでも保持中の引数を上書きしない
  // - 例外復旧: func が throw しても timerId/lastArgs はクリア済みで次サイクルが動く
  function run(args: Args) {
    timerId = null;
    lastArgs = null;
    func(...args);
  }

  function cancel() {
    clearTimer(timerId);
    timerId = null;
    lastArgs = null;
  }

  function flush() {
    if (lastArgs === null) {
      return;
    }

    clearTimer(timerId);
    run(lastArgs);
  }

  function debounced(...args: Args): void {
    lastArgs = args;
    clearTimer(timerId);
    timerId = setTimeout(() => {
      run(args);
    }, wait);
  }

  return Object.assign(debounced, { cancel, flush });
}

export interface DebounceOptions {
  signal?: AbortSignal;
  edges?: Array<"leading" | "trailing">;
  /**
   * 連続呼び出し中でも最低 `maxWait` ms 以内に必ず `func` が実行されることを保証する。
   * `wait` 未満の値は `wait` にクランプされる。
   */
  maxWait?: number;
}

/** @public */
export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /**
   * 現在の lastArgs でタイマーを再スケジュールする。引数が未設定の場合はタイマー発火時に何も実行されない。leading
   * のクールダウン状態はリセットしない。
   */
  schedule: () => void;
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
  options?: DebounceOptions,
): DebouncedFunction<Args> {
  assertNonNegativeFinite("wait", wait);

  const edges = options?.edges ?? ["trailing"];
  const hasLeading = edges.includes("leading");
  const hasTrailing = edges.includes("trailing");

  const rawMaxWait = options?.maxWait;
  if (rawMaxWait !== undefined) {
    assertNonNegativeFinite("maxWait", rawMaxWait);
  }
  // lodash 互換: maxWait < wait は wait にクランプ
  const maxWait =
    rawMaxWait === undefined ? undefined : Math.max(rawMaxWait, wait);

  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastArgs: Args | undefined = undefined;
  let lastThis: unknown = undefined;
  // maxWait の経過判定に使う基準時刻。
  // 新規バースト開始時と invoke 時に `Date.now()` で更新する。
  let baselineTime: number | undefined = undefined;
  let isLeadingInvoked = false;
  let isAborted = options?.signal?.aborted ?? false;

  function invoke() {
    if (lastArgs !== undefined) {
      const args = lastArgs;
      const thisArg = lastThis;
      // 先に内部状態をクリアすることで、func 内からの再帰呼び出しで
      // 設定された lastArgs/lastThis を上書きしない
      lastArgs = undefined;
      lastThis = undefined;
      baselineTime = Date.now();
      Reflect.apply(func, thisArg, args);
    }
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    lastArgs = undefined;
    lastThis = undefined;
    baselineTime = undefined;
    isLeadingInvoked = false;
  }

  function flush() {
    if (isAborted || timerId === undefined) {
      return;
    }
    clearTimeout(timerId);
    timerId = undefined;
    try {
      invoke();
    } finally {
      isLeadingInvoked = false;
    }
  }

  function schedule() {
    if (isAborted) {
      return;
    }
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    let delay = wait;
    let maxWaitForced = false;
    if (maxWait !== undefined && baselineTime !== undefined) {
      const maxRemaining = maxWait - (Date.now() - baselineTime);
      if (maxRemaining <= 0) {
        delay = 0;
        maxWaitForced = true;
      } else if (maxRemaining < delay) {
        delay = maxRemaining;
      }
    }

    timerId = setTimeout(() => {
      timerId = undefined;
      try {
        // maxWait の強制発火では hasTrailing=false でも invoke する
        if (hasTrailing || maxWaitForced) {
          invoke();
        } else {
          lastArgs = undefined;
          lastThis = undefined;
        }
      } finally {
        isLeadingInvoked = false;
      }
    }, delay);
  }

  const debounced: DebouncedFunction<Args> = Object.assign(
    function invokeDebounced(this: unknown, ...args: Args) {
      if (isAborted) {
        return;
      }

      lastArgs = args;
      // 呼び出し側の this を func 発火時まで保持する (ラッパーの本質)
      // oxlint-disable-next-line no-this-alias, no-this-assignment
      lastThis = this;

      // 新しいバーストの開始: maxWait のベースラインを更新
      // (前回の invoke から時間が経った後の呼び出しが誤って maxWait 強制発火扱いに
      // なるのを防ぐため、毎バーストで baselineTime を再設定する)
      if (timerId === undefined) {
        baselineTime = Date.now();
      }

      if (hasLeading && !isLeadingInvoked) {
        isLeadingInvoked = true;
        try {
          invoke();
        } finally {
          schedule();
        }
        return;
      }

      schedule();
    },
    { schedule, cancel, flush },
  );

  if (options?.signal && !isAborted) {
    options.signal.addEventListener(
      "abort",
      () => {
        cancel();
        isAborted = true;
      },
      { once: true },
    );
  }

  return debounced;
}

interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Clears the pending timer and resets internal state. */
  cancel: () => void;
  /** Immediately runs the pending callback. Does nothing if nothing is pending. */
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
 * An unset timer is represented by null, so the conditional clearTimeout call
 * is confined here.
 *
 * @param id - The timer ID to clear, or `null` if unset
 */
function clearTimer(id: ReturnType<typeof setTimeout> | null): void {
  if (id !== null) {
    clearTimeout(id);
  }
}

/**
 * Creates a function that delays invoking `func` until `wait` milliseconds have
 * elapsed since the last call.
 *
 * @param func - The function to delay
 * @param wait - Delay in milliseconds. Throws `TypeError` unless it is a finite
 *   non-negative number
 * @returns The debounced function with `cancel` / `flush`
 */
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): DebouncedFunction<Args> {
  assertNonNegativeFinite("wait", wait);

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args | null = null;

  // Clear internal state before invoking func. This ensures:
  // - Reentrancy: calling debounced() from inside func does not overwrite the held arguments
  // - Error recovery: even if func throws, timerId/lastArgs are already cleared so the next cycle works
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

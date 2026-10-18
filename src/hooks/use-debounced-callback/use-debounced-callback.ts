import { useEffect, useState } from "react";
import { debounce } from "../../utils/debounce";

/**
 * Debounce instance that holds the latest `callback`.
 *
 * It holds a live `setTimeout`, so if its identity changes, the pending call is
 * silently lost. Keeping the state outside React (in a plain closure) makes
 * identity stability independent of whether memoization happens. `wait` is
 * fixed at creation.
 *
 * @typeParam Args - Argument tuple of `callback`
 * @param callback - Initial callback to debounce
 * @param wait - Debounce delay in milliseconds
 * @returns The debounced `invoke`, `cancel`, `setCallback` to swap in the
 *   latest callback, and the `wait` used at creation
 */
function createDebouncedRunner<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number
) {
  let latestCallback = callback;

  // Pass the arguments as a single tuple value. This way debounce only does its
  // actual job: keeping just the latest arguments.
  const debounced = debounce((args: Args) => {
    latestCallback(...args);
  }, wait);

  function invoke(...args: Args) {
    debounced(args);
  }

  invoke.cancel = debounced.cancel;
  invoke.flush = debounced.flush;

  return {
    wait,
    invoke,
    cancel: debounced.cancel,
    setCallback(next: (...args: Args) => void) {
      latestCallback = next;
    },
  };
}

/**
 * Hook that returns a debounced `callback`. Passing a new inline arrow function
 * on every render does not lose the pending timer, and the callback that is
 * current at fire time is called. It is recreated only when `wait` changes; the
 * old pending call is discarded in cleanup.
 *
 * The instance is held via lazy `useState` initialization. React guarantees the
 * initializer runs only once, so identity stability does not depend on
 * memoization (`useMemo` and React Compiler's automatic memoization are
 * optimizations, not guarantees).
 *
 * @typeParam Args - Argument tuple of `callback`
 * @param callback - Callback to debounce
 * @param wait - Debounce delay in milliseconds
 * @returns The debounced function. `cancel` / `flush` discard / immediately run
 *   the pending call
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number
) {
  const [runner, setRunner] = useState(() =>
    createDebouncedRunner(callback, wait)
  );

  // Recreate when wait changes, following React's "adjusting state when a prop changes" pattern.
  if (runner.wait !== wait) {
    setRunner(createDebouncedRunner(callback, wait));
  }

  useEffect(() => {
    runner.setCallback(callback);
  }, [callback, runner]);

  useEffect(
    () => () => {
      runner.cancel();
    },
    [runner]
  );

  return runner.invoke;
}

/**
 * External store holding the visibility state of the full-screen
 * LoadingOverlay. Exposes `subscribe` / `getSnapshot`, which can be passed
 * straight to `useSyncExternalStore`, and show / hide / promise / reset for
 * callers to control visibility via reference counting.
 */

import { createListenerSet } from "../../../../utils/listener-set";

interface LoadingStore {
  /**
   * Whether it is currently visible (`count > 0`). Meant to be passed as
   * getSnapshot to `useSyncExternalStore`.
   */
  getSnapshot: () => boolean;
  /** Always hidden during SSR. useSyncExternalStore swaps it out on hydration. */
  getServerSnapshot: () => boolean;
  /**
   * Registers a listener. Each subscription is independent, even for the same
   * listener reference. The returned unsubscribe is idempotent; calling it
   * multiple times has no side effects.
   */
  subscribe: (listener: () => void) => () => void;

  /**
   * Increments the counter and notifies listeners. Contract: notifies on every
   * call, not only when the boolean state (`count > 0`) flips.
   */
  show: () => void;
  /**
   * Decrements the counter and notifies listeners.
   * No-op when count === 0 (listeners are not called).
   */
  hide: () => void;
  /**
   * Calls `show()`, awaits the promise, and calls `hide()` once it settles
   * (resolve or reject). The return value passes through the original promise's
   * settled result.
   */
  promise: <T>(promise: Promise<T>) => Promise<T>;
  /**
   * Resets the counter to 0 immediately and notifies listeners. No-op when
   * count === 0.
   */
  reset: () => void;
}

/**
 * Creates a reference-counted loading visibility store.
 *
 * @returns A loading store in its initial (hidden) state.
 */
export function createLoadingStore(): LoadingStore {
  const { subscribe, notify } = createListenerSet("loadingStore");
  let count = 0;

  const show = (): void => {
    count += 1;
    notify();
  };

  const hide = (): void => {
    if (count === 0) {
      return;
    }

    count -= 1;
    notify();
  };

  const reset = (): void => {
    if (count === 0) {
      return;
    }

    count = 0;
    notify();
  };

  const promise = async <T>(target: Promise<T>): Promise<T> => {
    show();

    try {
      return await target;
    } finally {
      hide();
    }
  };

  return {
    getSnapshot: () => count > 0,
    getServerSnapshot: () => false,
    subscribe,
    show,
    hide,
    promise,
    reset,
  };
}

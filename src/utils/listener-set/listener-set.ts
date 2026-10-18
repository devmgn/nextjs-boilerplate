/**
 * Subscriber management for external stores used with `useSyncExternalStore`.
 * Provides per-session subscriptions, idempotent unsubscription, and
 * error-tolerant notification.
 */

/** Subscribe / notify function pair to embed in an external store. */
export interface ListenerSet {
  /**
   * Registers a listener. Each session is handled independently, even for the
   * same listener reference. The returned unsubscribe is idempotent; calling it
   * multiple times has no side effects.
   */
  subscribe: (listener: () => void) => () => void;
  /** Synchronously calls all registered listeners in subscription order. */
  notify: () => void;
}

interface ListenerSetOptions {
  /** Called right before the subscriber count goes from 0 to 1. */
  onFirstSubscribe?: () => void;
  /** Called right after the subscriber count goes from 1 to 0. */
  onLastUnsubscribe?: () => void;
}

/**
 * Creates a subscriber management object.
 *
 * @param label - Store name attached to `console.error` when a listener throws
 * @param options - Hooks called when the subscriber count crosses the 0/1
 *   boundary
 * @returns The subscribe and notify function pair
 */
export function createListenerSet(
  label: string,
  { onFirstSubscribe, onLastUnsubscribe }: ListenerSetOptions = {}
): ListenerSet {
  const listeners = new Set<() => void>();

  /**
   * Swallows errors thrown by a listener so they don't stop notifications to
   * other sessions.
   *
   * @param listener - The listener to call
   */
  const invoke = (listener: () => void): void => {
    try {
      listener();
    } catch (error) {
      console.error(`${label} listener threw:`, error);
    }
  };

  const notify = (): void => {
    // Take a snapshot so subscribe/unsubscribe inside a listener is safe
    const snapshot = [...listeners];

    for (const sessionListener of snapshot) {
      sessionListener();
    }
  };

  const subscribe = (listener: () => void): (() => void) => {
    if (listeners.size === 0) {
      onFirstSubscribe?.();
    }

    // Register a unique wrapper per session so that subscribing the same listener reference
    // multiple times is not collapsed by Set deduplication
    const sessionListener = (): void => {
      invoke(listener);
    };

    listeners.add(sessionListener);

    let unsubscribed = false;

    return () => {
      if (unsubscribed) {
        return;
      }

      unsubscribed = true;
      listeners.delete(sessionListener);

      if (listeners.size === 0) {
        onLastUnsubscribe?.();
      }
    };
  };

  return { subscribe, notify };
}

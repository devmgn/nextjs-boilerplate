/**
 * Store that subscribes to `document` composition events and shares the IME
 * composition state. Exposes `subscribe` / `getSnapshot` that can be passed
 * directly to `useSyncExternalStore`.
 */

import { createListenerSet } from "../../../../utils/listener-set";

interface CompositionStore {
  getSnapshot: () => boolean;
  subscribe: (listener: () => void) => () => void;
}

/**
 * Installs composition event listeners on the document and returns a function
 * that removes them.
 *
 * @param capture - Whether to subscribe in the capture phase
 * @param onChange - Callback that receives whether composition is in progress
 *   each time it starts / commits
 * @returns Function that removes the installed listeners
 */
function listenComposition(
  capture: boolean,
  onChange: (composing: boolean) => void
): () => void {
  const onCompositionStart = (): void => {
    onChange(true);
  };

  const onCompositionEnd = (): void => {
    onChange(false);
  };

  document.addEventListener("compositionstart", onCompositionStart, capture);
  document.addEventListener("compositionend", onCompositionEnd, capture);

  return () => {
    document.removeEventListener(
      "compositionstart",
      onCompositionStart,
      capture
    );
    document.removeEventListener("compositionend", onCompositionEnd, capture);
  };
}

/**
 * Creates a reference-counted store that installs document listeners on the
 * first subscribe and removes them when the last subscriber leaves.
 *
 * @param capture - Whether to subscribe to composition events in the capture
 *   phase
 * @returns `subscribe` / `getSnapshot` that can be passed to
 *   `useSyncExternalStore`
 */
export function createCompositionStore(capture: boolean): CompositionStore {
  let composing = false;
  let unlisten: (() => void) | null = null;

  const listenerSet = createListenerSet("compositionStore", {
    onFirstSubscribe: () => {
      unlisten = listenComposition(capture, (next) => {
        composing = next;
        listenerSet.notify();
      });
    },
    onLastUnsubscribe: () => {
      // Reset the flag here so a compositionend missed while unsubscribed
      // doesn't leave a stale true on the next subscribe
      composing = false;
      unlisten?.();
      unlisten = null;
    },
  });

  return {
    getSnapshot: () => composing,
    subscribe: listenerSet.subscribe,
  };
}

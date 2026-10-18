import { useSyncExternalStore } from "react";

/**
 * Custom hook that watches whether a media query matches
 *
 * @param query - Media query string to watch
 * @param onChange - Callback called when the match state changes
 * @returns Whether the media query matches. `false` on the server
 */
export function useMediaQuery(
  query: string,
  onChange?: (event: MediaQueryListEvent) => void
): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(query);

      const handler = (event: MediaQueryListEvent) => {
        onStoreChange();
        onChange?.(event);
      };

      mql.addEventListener("change", handler);

      return () => {
        mql.removeEventListener("change", handler);
      };
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

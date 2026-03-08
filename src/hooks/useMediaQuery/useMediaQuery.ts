import { useSyncExternalStore } from "react";

/**
 * メディアクエリの一致状態を監視するカスタムフック
 */
export function useMediaQuery(
  query: string,
  onChange?: (event: MediaQueryListEvent) => void,
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
    () => false,
  );
}

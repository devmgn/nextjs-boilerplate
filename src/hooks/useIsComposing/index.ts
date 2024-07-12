import { useState, useSyncExternalStore } from "react";

const COMPOSITION_EVENT_NAMES = [
  "compositionstart",
  "compositionupdate",
  "compositionend",
] as const;

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
export const useIsComposing = (): boolean => {
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const handleComposition = ({ type }: CompositionEvent) => {
    setIsComposing(type !== "compositionend");
  };

  const subscribe = () => {
    for (const eventName of COMPOSITION_EVENT_NAMES) {
      document.addEventListener(eventName, handleComposition);
    }

    return () => {
      for (const eventName of COMPOSITION_EVENT_NAMES) {
        document.removeEventListener(eventName, handleComposition);
      }
    };
  };

  return useSyncExternalStore<boolean>(
    subscribe,
    () => isComposing,
    () => false,
  );
};

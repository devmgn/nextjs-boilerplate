import { useState, useSyncExternalStore } from 'react';

const COMPOSITION_EVENT_NAMES = [
  'compositionstart',
  'compositionupdate',
  'compositionend',
] as const;

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
export const useIsComposing = (): boolean => {
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const handleComposition = ({ type }: Event) => {
    setIsComposing(type !== 'compositionend');
  };

  const subscribe = () => {
    COMPOSITION_EVENT_NAMES.forEach((eventName) => {
      document.addEventListener(eventName, handleComposition);
    });

    return () => {
      COMPOSITION_EVENT_NAMES.forEach((eventName) => {
        document.removeEventListener(eventName, handleComposition);
      });
    };
  };

  return useSyncExternalStore<boolean>(
    subscribe,
    () => isComposing,
    () => false,
  );
};

import { useCallback } from 'react';
import { useBoolean, useEvent } from 'react-use';

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
const useIsComposing = (
  target?: Parameters<typeof useEvent>[2],
  options?: Parameters<typeof useEvent>[3],
): boolean => {
  const [isComposing, setIsComposing] = useBoolean(false);

  const handleComposition = useCallback(
    (event: Event) => {
      setIsComposing(event.type !== 'compositionend');
    },
    [setIsComposing],
  );

  useEvent('compositionstart', handleComposition, target, options);
  useEvent('compositionupdate', handleComposition, target, options);
  useEvent('compositionend', handleComposition, target, options);

  return isComposing;
};

export default useIsComposing;

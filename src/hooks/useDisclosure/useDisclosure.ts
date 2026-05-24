import { useToggle } from "../useToggle";

/** モーダルなどのコンポーネントの開閉状態を管理するためのカスタムフック */
export function useDisclosure(initialState = false) {
  const [isOpen, toggleOpen] = useToggle(initialState);
  const open = () => {
    toggleOpen(true);
  };
  const close = () => {
    toggleOpen(false);
  };
  // toggle() のテストは存在するが、v8 カバレッジが React Compiler のメモ化と相互作用してアロー関数の閉じブロックを未到達ブランチと誤判定するため除外している
  /* v8 ignore start */
  const toggle = () => {
    toggleOpen();
  };
  /* v8 ignore stop */

  return { isOpen, open, close, toggle };
}

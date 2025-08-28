import { useState } from "react";

/**
 * モーダルなどのコンポーネントの開閉状態を管理するためのカスタムフック
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setOpen] = useState(initialState);

  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
}

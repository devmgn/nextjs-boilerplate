import { useReducer } from "react";

type Action = "open" | "close" | "toggle";

function reducer(state: boolean, action: Action) {
  switch (action) {
    case "open":
      return true;
    case "close":
      return false;
    case "toggle":
      return !state;
    default:
      return state;
  }
}

/**
 * モーダルなどのコンポーネントの開閉状態を管理するためのカスタムフック
 */
export function useDisclosure(initialState = false) {
  const [isOpen, dispatch] = useReducer(reducer, initialState);

  const open = () => {
    dispatch("open");
  };
  const close = () => {
    dispatch("close");
  };
  const toggle = () => {
    dispatch("toggle");
  };

  return { isOpen, open, close, toggle };
}

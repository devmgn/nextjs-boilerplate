import { useToggle } from "../use-toggle";

/**
 * Custom hook that manages the open/closed state of components such as modals
 *
 * @param initialState - Initial open state
 * @returns The open state `isOpen` and `open` / `close` / `toggle` to control
 *   it
 */
export function useDisclosure(initialState = false) {
  const [isOpen, toggleOpen] = useToggle(initialState);

  const open = () => {
    toggleOpen(true);
  };

  const close = () => {
    toggleOpen(false);
  };

  // toggle() is tested, but excluded because v8 coverage interacts with React Compiler memoization and misreports the arrow function's closing block as an unreached branch
  /* v8 ignore start */
  const toggle = () => {
    toggleOpen();
  };
  /* v8 ignore stop */

  return { isOpen, open, close, toggle };
}

import { Presence } from "@radix-ui/react-presence";
import { Backdrop } from "../Backdrop";
import { Spinner } from "../Spinner";

interface LoadingViewProps {
  open: boolean;
}

/**
 * Backdrop と Spinner を合成した全画面ローディングの視覚層。
 * Spinner は Backdrop の `aria-hidden` サブツリーに入れず、AT に読み上げさせるため
 * 兄弟要素として Presence で制御する。
 */
export function LoadingView(props: LoadingViewProps) {
  const { open } = props;

  return (
    <>
      <Backdrop open={open} className="z-40" />
      <Presence present={open}>
        <div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
          data-state={open ? "open" : "closed"}
        >
          <Spinner size="xl" />
        </div>
      </Presence>
    </>
  );
}

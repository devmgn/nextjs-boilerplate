import { TanstackQueryProvider } from "./TanstackQueryProvider";

export function RootProvider({ children }: React.PropsWithChildren) {
  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
}

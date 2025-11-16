import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WebVitalsReporter } from "../../lib/WebVitalsReporter";
import { isProduction } from "../../utils/nodeEnv";
import { QueryClientProvider } from "../QueryClientProvider";

export function RootProvider(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <>
      <NuqsAdapter>
        <QueryClientProvider>{children}</QueryClientProvider>
      </NuqsAdapter>
      {!isProduction && <WebVitalsReporter />}
    </>
  );
}

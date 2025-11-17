import { NuqsAdapter } from "nuqs/adapters/next/app";
import { isProduction } from "../../utils/nodeEnv";
import { AppErrorBoundary } from "../AppErrorBoundary";
import { QueryClientProvider } from "../QueryClientProvider";
import { WebVitalsReporter } from "../WebVitalsReporter";

export function RootProvider(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <>
      <NuqsAdapter>
        <AppErrorBoundary>
          <QueryClientProvider>{children}</QueryClientProvider>
        </AppErrorBoundary>
      </NuqsAdapter>
      {!isProduction && <WebVitalsReporter />}
    </>
  );
}

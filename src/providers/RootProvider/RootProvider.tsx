import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WebVitalsReporter } from "../../lib/WebVitalsReporter";
import { isProduction } from "../../utils/runtime";
import { AppErrorBoundary } from "../AppErrorBoundary";
import { QueryClientProvider } from "../QueryClientProvider";

export function RootProvider(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <AppErrorBoundary>
      <NuqsAdapter>
        <QueryClientProvider>
          {children}
          {!isProduction && <WebVitalsReporter />}
        </QueryClientProvider>
      </NuqsAdapter>
    </AppErrorBoundary>
  );
}

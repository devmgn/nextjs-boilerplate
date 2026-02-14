import { NuqsAdapter } from "nuqs/adapters/next/app";
import { isProduction } from "../../utils/runtime";
import { AppErrorBoundary } from "../AppErrorBoundary";
import { QueryClientProvider } from "../QueryClientProvider";
import { WebVitalsReporter } from "../WebVitalsReporter";

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

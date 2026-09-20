import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import { LoadingOverlay } from "../components/loading-overlay/loading-overlay";
import { ENV } from "../env";
import { WebVitalsReporter } from "../lib/web-vitals-reporter";
import { AppErrorBoundary } from "../providers/app-error-boundary";
import { QueryClientProvider } from "../providers/query-client-provider";
import { isProduction } from "../utils/runtime";
import "../lib/styles/globals.css";

export const metadata: Metadata = {
  title: ENV.APP_NAME,
  description: ENV.DEFAULT_DESCRIPTION,
  icons: ["images/favicon.ico"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function Layout(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <AppErrorBoundary>
          <NuqsAdapter>
            <QueryClientProvider>{children}</QueryClientProvider>
          </NuqsAdapter>
        </AppErrorBoundary>
        <Toaster richColors closeButton />
        <LoadingOverlay />
        {!isProduction && <WebVitalsReporter />}
      </body>
    </html>
  );
}

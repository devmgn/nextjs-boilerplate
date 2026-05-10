import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { ENV } from "../config/env";
import { WebVitalsReporter } from "../lib/WebVitalsReporter";
import { AppErrorBoundary } from "../providers/AppErrorBoundary";
import { QueryClientProvider } from "../providers/QueryClientProvider";
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

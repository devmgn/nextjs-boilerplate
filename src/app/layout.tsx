import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import { LoadingOverlay } from "../components/loading-overlay/loading-overlay";
import { ENV } from "../env";
import { WebVitalsReporter } from "../lib/web-vitals-reporter";
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

/**
 * Root layout for the whole app. Places the providers, Toaster, and loading
 * overlay.
 *
 * @param props - The nested page
 * @returns The app's HTML document
 */
export default function Layout(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <NuqsAdapter>
          <QueryClientProvider>{children}</QueryClientProvider>
        </NuqsAdapter>
        <Toaster richColors closeButton />
        <LoadingOverlay />
        {!isProduction && <WebVitalsReporter />}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { ENV } from "../config/env";
import { WebVitalsReporter } from "../lib/WebVitalsReporter";
import { RootProvider } from "../providers/RootProvider";
import { isProduction } from "../utils/nodeEnv";
import { parseEnv } from "../utils/parseEnv";
import "./globals.css";

export const metadata: Metadata = {
  title: parseEnv(ENV.appName),
  description: parseEnv(ENV.defaultDescription),
  icons: ["images/favicon.ico"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="ja">
      <body>
        {!isProduction && <WebVitalsReporter />}
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { ENV } from "../config/env";
import { RootProvider } from "../providers/RootProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: ENV.appName,
  description: ENV.defaultDescription,
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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

import { ENV_KEY } from "@/config";
import { RootProvider } from "@/providers";
import { getEnv } from "@/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: getEnv(ENV_KEY.appName),
  description: getEnv(ENV_KEY.defaultDescription),
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

import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ENV } from "../config/env";
import { RootProvider } from "../providers/RootProvider";
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
        <RootProvider>{children}</RootProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}

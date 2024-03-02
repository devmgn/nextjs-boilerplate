import { APP_NAME, DEFAULT_DESCRIPTION } from '@/config/env';
import { RootProvider } from '@/providers';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: APP_NAME,
  description: DEFAULT_DESCRIPTION,
  icons: ['images/favicon.ico'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ja">
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;

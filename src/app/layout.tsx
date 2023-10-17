import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { APP_NAME, DEFAULT_DESCRIPTION } from '@/config/env';
import RootProvider from '@/providers/RootProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: APP_NAME,
  description: DEFAULT_DESCRIPTION,
  icons: ['images/favicon.ico'],
  viewport: 'width=device-width,initial-scale=1.0,minimum-scale=1.0',
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ja">
      <body>
        <RootProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;

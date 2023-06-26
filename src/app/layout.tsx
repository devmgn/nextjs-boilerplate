import { APP_NAME, DEFAULT_DESCRIPTION } from '@/config';
import { GlobalStyle, StyledComponentsRegistry, ThemeProvider } from '@/features/styledComponents';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: APP_NAME,
  description: DEFAULT_DESCRIPTION,
  icons: ['images/favicon.ico'],
  viewport: 'width=device-width,initial-scale=1.0,minimum-scale=1.0',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <GlobalStyle />
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;

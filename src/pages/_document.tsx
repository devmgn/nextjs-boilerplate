import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '@/styles/createEmotionCache';
import type { AppProps } from './_app';
import type { AppType } from 'next/app';
import type { DocumentContext, DocumentProps as NextDocumentProps } from 'next/document';

type DocumentProps = NextDocumentProps & { emotionStyleTags: JSX.Element[] };

const Document = ({ emotionStyleTags }: DocumentProps) => {
  return (
    <Html lang="ja">
      <Head>{emotionStyleTags}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

Document.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp:
        (App: React.ComponentType<React.ComponentProps<AppType> & AppProps>) => (props) => {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await NextDocument.getInitialProps(ctx);
  const emotionServer = createEmotionServer(cache);
  const emotionStyles = emotionServer.extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

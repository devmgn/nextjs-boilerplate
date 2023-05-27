import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { DefaultHead } from '@/features/head';
import { createEmotionCache } from '@/lib/styles';
import type { AppProps } from './_app';
import type { AppType } from 'next/app';
import type { DocumentProps as NextDocumentProps, DocumentContext } from 'next/document';

type DocumentProps = {
  emotionStyleTags: JSX.Element[];
} & NextDocumentProps;

const Document = ({ emotionStyleTags }: DocumentProps) => {
  return (
    <Html lang="ja">
      <Head>
        <DefaultHead />
        {emotionStyleTags}
      </Head>
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
  const emotionServer = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & AppProps>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await NextDocument.getInitialProps(ctx);
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

import { render } from '@testing-library/react';
import { Head } from '@/components/layouts';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactElement[] }) => <>{children}</>,
  };
});

describe('Head', () => {
  describe('スナップショットテスト', () => {
    test('propsが全てある場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(
        <Head {...props}>
          <meta name="keywords" content="keywords" />
        </Head>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsがない場合', () => {
      render(
        <Head>
          <meta name="keywords" content="keywords" />
        </Head>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにtitleがない場合', () => {
      const props = {
        description: 'description',
      };
      render(
        <Head {...props}>
          <meta name="keywords" content="keywords" />
        </Head>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにdescriptionがない場合', () => {
      const props = {
        title: 'title',
      };
      render(
        <Head {...props}>
          <meta name="keywords" content="keywords" />
        </Head>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにchildrenがない場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(<Head {...props} />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });
  });
});

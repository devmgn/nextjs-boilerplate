import { render } from '@testing-library/react';
import PageHead from '../PageHead';

describe('PageHead', () => {
  describe('スナップショットテスト', () => {
    test('propsが全てある場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(
        <PageHead {...props}>
          <meta name="keywords" content="keywords" />
        </PageHead>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsが全てない場合', () => {
      render(<PageHead />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });

    test('propsにtitleがない場合', () => {
      const props = {
        description: 'description',
      };
      render(
        <PageHead {...props}>
          <meta name="keywords" content="keywords" />
        </PageHead>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにdescriptionがない場合', () => {
      const props = {
        title: 'title',
      };
      render(
        <PageHead {...props}>
          <meta name="keywords" content="keywords" />
        </PageHead>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにchildrenがない場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(<PageHead {...props} />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });
  });
});

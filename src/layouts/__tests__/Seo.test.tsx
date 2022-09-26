import { render } from '@testing-library/react';
import Seo from '../Seo';

describe('Seo', () => {
  describe('スナップショットテスト', () => {
    test('propsが全てある場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(
        <Seo {...props}>
          <meta name="keywords" content="keywords" />
        </Seo>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsが全てない場合', () => {
      render(<Seo />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });

    test('propsにtitleがない場合', () => {
      const props = {
        description: 'description',
      };
      render(
        <Seo {...props}>
          <meta name="keywords" content="keywords" />
        </Seo>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにdescriptionがない場合', () => {
      const props = {
        title: 'title',
      };
      render(
        <Seo {...props}>
          <meta name="keywords" content="keywords" />
        </Seo>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにchildrenがない場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(<Seo {...props} />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });
  });
});

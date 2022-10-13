import { render } from '@testing-library/react';
import Meta from '../Meta';

describe('Meta', () => {
  describe('スナップショットテスト', () => {
    test('propsが全てある場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(
        <Meta {...props}>
          <meta name="keywords" content="keywords" />
        </Meta>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsが全てない場合', () => {
      render(<Meta />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });

    test('propsにtitleがない場合', () => {
      const props = {
        description: 'description',
      };
      render(
        <Meta {...props}>
          <meta name="keywords" content="keywords" />
        </Meta>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにdescriptionがない場合', () => {
      const props = {
        title: 'title',
      };
      render(
        <Meta {...props}>
          <meta name="keywords" content="keywords" />
        </Meta>,
        { container: document.head }
      );
      expect(document.head).toMatchSnapshot();
    });

    test('propsにchildrenがない場合', () => {
      const props = {
        title: 'title',
        description: 'description',
      };

      render(<Meta {...props} />, { container: document.head });
      expect(document.head).toMatchSnapshot();
    });
  });
});

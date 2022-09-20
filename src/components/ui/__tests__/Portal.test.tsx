import { render } from '@testing-library/react';
import { ROOT_CONTAINER_ID } from '@/constants';
import Portal from '../Portal';

describe('Portal', () => {
  describe('スナップショットテスト', () => {
    test('コンポーネントをレンダリングする要素があるとき', () => {
      let container: HTMLElement | null = document.createElement('div');
      container.id = ROOT_CONTAINER_ID;
      document.body.appendChild(container);

      const { asFragment } = render(<Portal>children</Portal>, { container: container! });
      expect(asFragment()).toMatchSnapshot();
      container = null;
    });

    test('コンポーネントをレンダリングする要素がないとき', () => {
      const { asFragment } = render(<Portal>children</Portal>);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});

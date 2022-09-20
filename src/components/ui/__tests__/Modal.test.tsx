import { render } from '@testing-library/react';
import { ROOT_CONTAINER_ID } from '@/constants';
import Modal from '../Modal';

const defaultState = {
  isActive: false,
  deactivate: jest.fn(),
  onDeactivate: jest.fn(),
};

const activeState = { ...defaultState, isActive: true };

describe('Modal', () => {
  let modal: HTMLElement | null;

  beforeEach(() => {
    modal = document.createElement('div');
    modal.id = ROOT_CONTAINER_ID;
    document.body.appendChild(modal);
  });

  afterEach(() => (modal = null));

  describe('スナップショットテスト', () => {
    test('初期表示', () => {
      const { asFragment } = render(<Modal {...defaultState}>children</Modal>, { container: modal! });
      expect(asFragment()).toMatchSnapshot();
    });

    test('isActiveがtrueの時', () => {
      const { asFragment } = render(<Modal {...activeState}>children</Modal>, { container: modal! });
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

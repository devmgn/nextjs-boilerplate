import { render } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});

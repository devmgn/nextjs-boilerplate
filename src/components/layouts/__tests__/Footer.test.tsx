import { render } from '@testing-library/react';
import { Footer } from '@/components/layouts';

describe('Footer', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});

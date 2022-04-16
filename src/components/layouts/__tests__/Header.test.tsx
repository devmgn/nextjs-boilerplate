import { render } from '@testing-library/react';
import { Header } from '@/components/layouts';

describe('Header', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});

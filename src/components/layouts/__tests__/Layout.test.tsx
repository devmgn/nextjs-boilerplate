import { render } from '@testing-library/react';
import { Layout } from '@/components/layouts';

describe('Layout', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Layout>children</Layout>);
    expect(asFragment()).toMatchSnapshot();
  });
});

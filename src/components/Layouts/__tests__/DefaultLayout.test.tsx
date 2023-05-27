import { render } from '@testing-library/react';
import DefaultLayout from '../DefaultLayout';

describe('DefaultLayout', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<DefaultLayout>children</DefaultLayout>);
    expect(asFragment()).toMatchSnapshot();
  });
});

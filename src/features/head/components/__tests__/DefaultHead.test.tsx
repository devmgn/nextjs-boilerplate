import { render } from '@testing-library/react';
import DefaultHead from '../DefaultHead';

describe('DefaultHead', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<DefaultHead />);
    expect(asFragment()).toMatchSnapshot();
  });
});

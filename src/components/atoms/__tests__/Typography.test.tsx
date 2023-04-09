import { render } from '@testing-library/react';
import Typography from '../Typography';

describe('Typography', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Typography />);
    expect(asFragment()).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';
import Text from '../Text';

describe('Text', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Text>children</Text>);
    expect(asFragment()).toMatchSnapshot();
  });
});

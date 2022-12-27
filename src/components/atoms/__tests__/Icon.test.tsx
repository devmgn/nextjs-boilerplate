import { render } from '@testing-library/react';
import { ExampleIcon } from '../Icon';

describe('Icon', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<ExampleIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});

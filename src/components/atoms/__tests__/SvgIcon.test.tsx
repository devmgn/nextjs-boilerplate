import { render } from '@testing-library/react';
import { Help } from '@/assets/icons/';
import SvgIcon from '../SvgIcon';

describe('Icon', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<SvgIcon as={Help} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

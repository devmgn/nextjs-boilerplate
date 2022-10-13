import { render } from '@testing-library/react';
import Paragraph from '../Paragraph';

describe('Paragraph', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Paragraph>children</Paragraph>);
    expect(asFragment()).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';
import Dialog from '../Dialog';

describe('Dialog', () => {
  test('スナップショットテスト', () => {
    const { asFragment } = render(<Dialog>children</Dialog>);
    expect(asFragment()).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';
import DefaultHead from '../DefaultHead';

describe('DefaultHead', () => {
  test('スナップショットテスト', () => {
    render(<DefaultHead />, { container: document.head });
    expect(document.head).toMatchSnapshot();
  });
});

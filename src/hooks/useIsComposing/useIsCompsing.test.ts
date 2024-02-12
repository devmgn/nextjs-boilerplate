import { act, renderHook } from '@testing-library/react';
import { useIsComposing } from '.';
import type { RenderHookResult } from '@testing-library/react';

const testPatterns: [string, boolean][] = [
  ['compositionstart', true],
  ['compositionupdate', true],
  ['compositionend', false],
];

describe('useIsComposing', () => {
  let hookResult: RenderHookResult<boolean, unknown>;

  beforeEach(() => {
    hookResult = renderHook(() => useIsComposing());
  });

  test('デフォルトはfalseが返却されること', () => {
    const { result } = hookResult;
    expect(result.current).toBe(false);
  });

  describe.each(testPatterns)('イベントが%sのとき', (eventName, expected) => {
    test(`${expected.toString()}が返却されること`, () => {
      const { result } = hookResult;

      act(() => {
        const event = new Event(eventName);
        window.dispatchEvent(event);
      });

      expect(result.current).toBe(expected);
    });
  });
});

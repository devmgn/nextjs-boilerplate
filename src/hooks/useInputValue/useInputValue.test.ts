import { act, renderHook } from '@testing-library/react';
import { useInputValue } from './useInputValue';

const initialValue = 'initial value';
const updatedValue = 'updated value';

describe('useInputValue', () => {
  let result: { current: ReturnType<typeof useInputValue> };

  describe('初期値が空のとき', () => {
    beforeEach(() => {
      const renderedHook = renderHook(() => useInputValue(''));
      result = renderedHook.result;
    });

    test('空文字がvalueに設定されること', () => {
      expect(result.current[0]).toBe('');
    });
  });

  describe('初期値が設定されているとき', () => {
    beforeEach(() => {
      const renderedHook = renderHook(() => useInputValue(initialValue));
      result = renderedHook.result;
    });

    test('初期値がvalueに正しく設定されること', () => {
      expect(result.current[0]).toBe(initialValue);
    });

    test('onChangeが実行された場合、その値がvalueに設定されること', () => {
      expect(result.current[0]).toBe(initialValue);

      act(() => {
        result.current[1]({
          target: { value: updatedValue },
        } as React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >);
      });

      expect(result.current[0]).toBe(updatedValue);
    });
  });
});

import { act, renderHook } from '@testing-library/react';
import useDisclosure from '../useDisclosure';

describe('useDisclosure', () => {
  let result: { current: ReturnType<typeof useDisclosure> };

  describe('初期値が未設定のとき', () => {
    beforeEach(() => {
      const renderedHook = renderHook(() => useDisclosure());
      result = renderedHook.result;
    });

    test('isOpenの初期値はfalseであること', () => {
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('初期値がtrueに設定されている時', () => {
    beforeEach(() => {
      const renderedHook = renderHook(() => useDisclosure(true));
      result = renderedHook.result;
    });

    test('isOpenの初期値はtrueであること', () => {
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('callbackの振る舞い', () => {
    beforeEach(() => {
      const renderedHook = renderHook(() => useDisclosure());
      result = renderedHook.result;
    });

    test('openを実行するとisOpenがtrueになること', () => {
      act(() => result.current.open());
      expect(result.current.isOpen).toBe(true);
    });

    test('closeを実行するとisOpenがfalseになること', () => {
      act(() => result.current.close());
      expect(result.current.isOpen).toBe(false);
    });

    test('toggleを実行すると、true/falseが切り替わること', () => {
      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(true);
      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(false);
    });
  });
});

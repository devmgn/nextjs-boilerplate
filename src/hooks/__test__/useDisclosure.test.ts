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
      expect(result.current[0]).toBe(false);
    });
  });

  describe('初期値がtrueに設定されている時', () => {
    beforeEach(() => {
      const renderedHook = renderHook(() => useDisclosure(true));
      result = renderedHook.result;
    });

    test('isOpenの初期値はtrueであること', () => {
      expect(result.current[0]).toBe(true);
    });
  });

  describe('callbackの振る舞い', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    beforeEach(() => {
      const renderedHook = renderHook(() =>
        useDisclosure(true, { onOpen, onClose }),
      );
      result = renderedHook.result;
      jest.clearAllMocks();
    });

    test('openを実行するとisOpenがtrueになること', () => {
      act(() => result.current[1].open());
      expect(result.current[0]).toBe(true);
      expect(onOpen).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    test('closeを実行するとisOpenがfalseになること', () => {
      act(() => result.current[1].close());
      expect(result.current[0]).toBe(false);
      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    test('toggleを実行すると、true/falseが切り替わること', () => {
      act(() => result.current[1].toggle());
      expect(result.current[0]).toBe(false);
      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      onOpen.mockClear();
      onClose.mockClear();

      act(() => result.current[1].toggle());
      expect(result.current[0]).toBe(true);
      expect(onOpen).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});

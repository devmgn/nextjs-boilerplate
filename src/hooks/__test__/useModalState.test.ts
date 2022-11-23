import { act, fireEvent, renderHook, RenderHookResult } from '@testing-library/react';
import useModal from '../useModal';

describe('useModal', () => {
  let hookResult: RenderHookResult<ReturnType<typeof useModal>, unknown>['result'];

  beforeEach(() => {
    hookResult = renderHook(() => useModal()).result;
  });

  test('isActiveの初期値はfalseであること', () => {
    expect(hookResult.current.isActive).toBe(false);
  });

  test('activateしたとき、isActiveはtrueであること', async () => {
    await act(() => hookResult.current.activate());
    expect(hookResult.current.isActive).toBe(true);
  });

  test('activate後にdeactivateしたとき、isActiveはfalseであること', async () => {
    await act(() => hookResult.current.activate());
    expect(hookResult.current.isActive).toBe(true);
    await act(() => hookResult.current.deactivate());
    expect(hookResult.current.isActive).toBe(false);
  });

  describe('escapeキーをタイプした時', () => {
    test('isActiveがfalseの場合、isActiveはfalseのままであること', () => {
      hookResult.current.deactivate = jest.fn();
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(hookResult.current.deactivate).not.toHaveBeenCalled();
      expect(hookResult.current.isActive).toBe(false);
    });

    test('isActiveがtrueの場合、isActiveはfalseとなること', async () => {
      await act(() => hookResult.current.activate());
      expect(hookResult.current.isActive).toBe(true);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(hookResult.current.isActive).toBe(false);
    });
  });

  describe('escape以外のキーをタイプした時', () => {
    test('isActiveがfalseの場合、isActiveはfalseのままであること', () => {
      hookResult.current.deactivate = jest.fn();
      fireEvent.keyDown(document, { key: 'Enter' });

      expect(hookResult.current.deactivate).not.toHaveBeenCalled();
      expect(hookResult.current.isActive).toBe(false);
    });

    test('isActiveがtrueの場合、isActiveはtrueのままであること', async () => {
      await act(() => hookResult.current.activate());
      expect(hookResult.current.isActive).toBe(true);

      fireEvent.keyDown(document, { key: 'Enter' });
      expect(hookResult.current.isActive).toBe(true);
    });
  });
});

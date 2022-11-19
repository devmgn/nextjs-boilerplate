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

  test('activateしたとき、isActiveはtrueであること', () => {
    act(() => hookResult.current.activate());
    expect(hookResult.current.isActive).toBe(true);
  });

  test('activate後にdeactivateしたとき、isActiveはfalseであること', () => {
    act(() => hookResult.current.activate());
    expect(hookResult.current.isActive).toBe(true);
    act(() => hookResult.current.deactivate());
    expect(hookResult.current.isActive).toBe(false);
  });

  describe('escapeキーをタイプした時', () => {
    test('isActiveがfalseの場合、isActiveはfalseのままであること', () => {
      hookResult.current.deactivate = jest.fn();
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(hookResult.current.deactivate).not.toBeCalled();
      expect(hookResult.current.isActive).toBe(false);
    });

    test('isActiveがtrueの場合、isActiveはfalseとなること', () => {
      act(() => hookResult.current.activate());
      expect(hookResult.current.isActive).toBe(true);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(hookResult.current.isActive).toBe(false);
    });
  });

  describe('escape以外のキーをタイプした時', () => {
    test('isActiveがfalseの場合、isActiveはfalseのままであること', () => {
      hookResult.current.deactivate = jest.fn();
      fireEvent.keyDown(document, { key: 'Enter' });

      expect(hookResult.current.deactivate).not.toBeCalled();
      expect(hookResult.current.isActive).toBe(false);
    });

    test('isActiveがtrueの場合、isActiveはtrueのままであること', () => {
      act(() => hookResult.current.activate());
      expect(hookResult.current.isActive).toBe(true);

      fireEvent.keyDown(document, { key: 'Enter' });
      expect(hookResult.current.isActive).toBe(true);
    });
  });
});

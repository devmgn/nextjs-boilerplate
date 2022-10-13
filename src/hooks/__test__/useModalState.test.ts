import { act, fireEvent, renderHook, RenderHookResult } from '@testing-library/react';
import useModalState from '../useModalState';

describe('useModalState', () => {
  let hookResult: RenderHookResult<ReturnType<typeof useModalState>, unknown>['result'];
  const onActivate = jest.fn();
  const onDeactivate = jest.fn();

  beforeEach(() => {
    hookResult = renderHook(() => useModalState({ onActivate, onDeactivate })).result;
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

  describe('オプション引数', () => {
    test('activateしたとき、onActivateコールバックが実行されること', () => {
      act(() => hookResult.current.activate());
      expect(onActivate).toHaveBeenCalled();
    });

    test('deActivateしたとき、onDeactivateコールバックが実行されること', () => {
      act(() => hookResult.current.deactivate());
      expect(onDeactivate).toHaveBeenCalled();
    });
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

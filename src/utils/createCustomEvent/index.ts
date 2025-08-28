/**
 * 指定されたタイプと初期化パラメータを使用してカスタムイベントを作成します。
 *
 * @template T - イベントのタイプ（GlobalEventHandlersEventMapのキー）
 * @template D - イベントの詳細データの型
 * @param {T} type - 作成するイベントのタイプ
 * @param {CustomEventInit<D>} [eventInitDict] - イベントの初期化パラメータ（オプション）
 * @returns {CustomEvent<D>} 新しいカスタムイベント
 *
 * @example
 * // グローバル宣言
 * declare global {
 *   interface GlobalEventHandlersEventMap {
 *     customEventName: CustomEvent<{ some: string }>;
 *   }
 * }
 *
 * // 使用例
 * const event = createCustomEvent('customEventName', {
 *   detail: { some: 'value' }
 * });
 * document.dispatchEvent(event);
 */
export function createCustomEvent<
  T extends keyof GlobalEventHandlersEventMap,
  D = GlobalEventHandlersEventMap[T] extends CustomEvent<infer U> ? U : never,
>(type: T, eventInitDict?: CustomEventInit<D>): CustomEvent<D> {
  return new CustomEvent(type, eventInitDict);
}

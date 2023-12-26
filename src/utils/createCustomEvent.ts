/**
 * 指定されたタイプと初期化パラメータを使用してカスタムイベントを作成します。
 *
 * @template T - イベントのタイプ。GlobalEventHandlersEventMapのキーの一部である必要があります。
 * @param {T} type - 作成するイベントのタイプ。
 * @param {CustomEventInit<GlobalEventHandlersEventMap[T] extends CustomEvent<infer U> ? U : never>} eventInitDict - イベントの初期化パラメータ。
 * @returns {CustomEvent} 指定されたタイプと初期化パラメータを持つ新しいカスタムイベント。
 *
 * @example
 * declare global {
 *   interface GlobalEventHandlersEventMap {
 *     customEventName: CustomEvent<{
 *       some: type;
 *     }>;
 *   }
 * }
 *
 * const event = createCustomEvent('customEventName', {
 *   detail: { some: 'value' },
 * });
 * document.dispatchEvent(event);
 */
const createCustomEvent = <T extends keyof GlobalEventHandlersEventMap>(
  type: T,
  eventInitDict: CustomEventInit<
    GlobalEventHandlersEventMap[T] extends CustomEvent<infer U> ? U : never
  >,
) => new CustomEvent(type, eventInitDict);

export default createCustomEvent;

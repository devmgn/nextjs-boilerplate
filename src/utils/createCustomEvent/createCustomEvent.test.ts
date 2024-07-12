import { createCustomEvent } from ".";

describe("createCustomEvent", () => {
  test("カスタムイベントが定義したパラメーターで初期化されること", () => {
    const type = "customEventName" as keyof GlobalEventHandlersEventMap;
    const detail = { some: "value" };
    // @ts-expect-error
    const event = createCustomEvent(type, { detail });

    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe(type);
    expect(event.detail).toEqual(detail);
  });
});

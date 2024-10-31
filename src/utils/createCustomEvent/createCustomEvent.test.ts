import { createCustomEvent } from ".";

declare global {
  interface GlobalEventHandlersEventMap {
    testEvent: CustomEvent<unknown>;
    customTestEvent: CustomEvent<{ data: string }>;
  }
}

describe("createCustomEvent", () => {
  it("タイプを指定したとき、そのタイプのCustomEventが作成されること", () => {
    const event = createCustomEvent("testEvent");
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe("testEvent");
  });

  it("detailを指定したとき、そのdetailを持つCustomEventが作成されること", () => {
    const detail = { test: "value" };
    const event = createCustomEvent("testEvent", { detail });
    expect(event.detail).toEqual(detail);
  });

  it("オプションを指定したとき、そのオプションを持つCustomEventが作成されること", () => {
    const event = createCustomEvent("testEvent", {
      bubbles: true,
      cancelable: true,
    });
    expect(event.bubbles).toBe(true);
    expect(event.cancelable).toBe(true);
  });

  it("detailを指定しないとき、detailがnullのCustomEventが作成されること", () => {
    const event = createCustomEvent("testEvent");
    expect(event.detail).toBeNull();
  });

  it("カスタムイベントタイプを使用したとき、正しく処理されること", () => {
    type CustomEventMap = {
      customTestEvent: CustomEvent<{ data: string }>;
    };

    const event = createCustomEvent<keyof CustomEventMap, { data: string }>(
      "customTestEvent",
      {
        detail: { data: "test" },
      },
    );

    expect(event.type).toBe("customTestEvent");
    expect(event.detail).toEqual({ data: "test" });
  });
});

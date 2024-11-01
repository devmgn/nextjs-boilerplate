describe("isServer", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("window が undefined のとき、isServer が true となること", async () => {
    vi.stubGlobal("window", undefined);
    const { isServer } = await import(".");
    expect(isServer).toBe(true);
  });

  it("window が定義されているとき、isServer が false となること", async () => {
    vi.stubGlobal("", {});
    const { isServer } = await import(".");
    expect(isServer).toBe(false);
  });
});

describe("isServer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.resetModules();
  });

  it("window が undefined のとき、isServer が true となること", async () => {
    vi.stubGlobal("window", undefined);
    const { isServer } = await import("./isServer");
    expect(isServer).toBe(true);
  });

  it("window が定義されているとき、isServer が false となること", async () => {
    vi.stubGlobal("", {});
    const { isServer } = await import("./isServer");
    expect(isServer).toBe(false);
  });
});

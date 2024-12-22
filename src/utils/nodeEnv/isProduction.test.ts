describe("isProduction", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // @ts-expect-error
    process.env.NODE_ENV = undefined;
    vi.resetModules();
  });

  afterEach(() => {
    // @ts-expect-error
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('NODE_ENVが"production"のとき、trueとなること', async () => {
    // @ts-expect-error
    process.env.NODE_ENV = "production";
    const { isProduction } = await import(".");
    expect(isProduction).toBe(true);
  });

  it('NODE_ENVが"production"以外のとき、falseとなること', async () => {
    // @ts-expect-error
    process.env.NODE_ENV = "development";
    const { isProduction } = await import(".");
    expect(isProduction).toBe(false);
  });

  it("NODE_ENVが未定義のとき、falseとなること", async () => {
    const { isProduction } = await import(".");
    expect(isProduction).toBe(false);
  });
});

describe("isDevelopment", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // @ts-expect-error
    process.env.NODE_ENV = undefined;
    vi.resetModules(); // モジュールキャッシュをリセット
  });

  afterEach(() => {
    // @ts-expect-error
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('NODE_ENVが"development"のとき、trueとなること', async () => {
    // @ts-expect-error
    process.env.NODE_ENV = "development";
    const { isDevelopment } = await import("."); // ファイル名を適切に変更してください
    expect(isDevelopment).toBe(true);
  });

  it('NODE_ENVが"development"以外のとき、falseとなること', async () => {
    // @ts-expect-error
    process.env.NODE_ENV = "production";
    const { isDevelopment } = await import("."); // ファイル名を適切に変更してください
    expect(isDevelopment).toBe(false);
  });

  it("NODE_ENVが未定義のとき、falseとなること", async () => {
    const { isDevelopment } = await import("."); // ファイル名を適切に変更してください
    expect(isDevelopment).toBe(false);
  });
});

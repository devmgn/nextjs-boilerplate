describe("runtime", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("isDevelopment", () => {
    it('NODE_ENVが"development"のとき、trueとなること', async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBe(true);
    });

    it('NODE_ENVが"development"以外のとき、falseとなること', async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBe(false);
    });

    it("NODE_ENVが未定義のとき、falseとなること", async () => {
      vi.stubEnv("NODE_ENV", "");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBe(false);
    });
  });

  describe("isProduction", () => {
    it('NODE_ENVが"production"のとき、trueとなること', async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBe(true);
    });

    it('NODE_ENVが"production"以外のとき、falseとなること', async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBe(false);
    });

    it("NODE_ENVが未定義のとき、falseとなること", async () => {
      vi.stubEnv("NODE_ENV", "");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBe(false);
    });
  });

  describe("isServer", () => {
    it("window が undefined のとき、isServer が true となること", async () => {
      vi.stubGlobal("window", undefined);
      const { isServer } = await import("./runtime");
      expect(isServer).toBe(true);
    });

    it("window が定義されているとき、isServer が false となること", async () => {
      vi.stubGlobal("window", {});
      const { isServer } = await import("./runtime");
      expect(isServer).toBe(false);
    });
  });
});

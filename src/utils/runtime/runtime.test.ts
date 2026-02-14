describe("runtime", () => {
  describe("isDevelopment", () => {
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

    it('NODE_ENVが"development"のとき、trueとなること', async () => {
      // @ts-expect-error
      process.env.NODE_ENV = "development";
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBe(true);
    });

    it('NODE_ENVが"development"以外のとき、falseとなること', async () => {
      // @ts-expect-error
      process.env.NODE_ENV = "production";
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBe(false);
    });

    it("NODE_ENVが未定義のとき、falseとなること", async () => {
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBe(false);
    });
  });

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
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBe(true);
    });

    it('NODE_ENVが"production"以外のとき、falseとなること', async () => {
      // @ts-expect-error
      process.env.NODE_ENV = "development";
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBe(false);
    });

    it("NODE_ENVが未定義のとき、falseとなること", async () => {
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBe(false);
    });
  });

  describe("isServer", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    beforeEach(() => {
      vi.resetModules();
    });

    it("window が undefined のとき、isServer が true となること", async () => {
      vi.stubGlobal("window", undefined);
      const { isServer } = await import("./runtime");
      expect(isServer).toBe(true);
    });

    it("window が定義されているとき、isServer が false となること", async () => {
      vi.stubGlobal("", {});
      const { isServer } = await import("./runtime");
      expect(isServer).toBe(false);
    });
  });
});

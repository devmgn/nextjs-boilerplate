import { beforeEach, describe, expect, it, vi } from "vitest";

describe("runtime", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("isDevelopment", () => {
    it('NODE_ENVが"development"のとき、trueとなること', async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBeTruthy();
    });

    it('NODE_ENVが"development"以外のとき、falseとなること', async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBeFalsy();
    });

    it("NODE_ENVが未定義のとき、falseとなること", async () => {
      vi.stubEnv("NODE_ENV", "");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBeFalsy();
    });
  });

  describe("isProduction", () => {
    it('NODE_ENVが"production"のとき、trueとなること', async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBeTruthy();
    });

    it('NODE_ENVが"production"以外のとき、falseとなること', async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBeFalsy();
    });

    it("NODE_ENVが未定義のとき、falseとなること", async () => {
      vi.stubEnv("NODE_ENV", "");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBeFalsy();
    });
  });

  describe("isServer", () => {
    it("window が undefined のとき、isServer が true となること", async () => {
      // 第 2 引数の undefined が値の打ち消しを表す
      // oxlint-disable-next-line unicorn/no-useless-undefined
      vi.stubGlobal("window", undefined);
      const { isServer } = await import("./runtime");
      expect(isServer).toBeTruthy();
    });

    it("window が定義されているとき、isServer が false となること", async () => {
      vi.stubGlobal("window", {});
      const { isServer } = await import("./runtime");
      expect(isServer).toBeFalsy();
    });
  });
});

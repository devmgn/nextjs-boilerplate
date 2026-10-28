import { beforeEach, describe, expect, it, vi } from "vitest";

describe("runtime", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("isDevelopment", () => {
    it('is true when NODE_ENV is "development"', async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBeTruthy();
    });

    it('is false when NODE_ENV is not "development"', async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBeFalsy();
    });

    it("is false when NODE_ENV is undefined", async () => {
      vi.stubEnv("NODE_ENV", "");
      const { isDevelopment } = await import("./runtime");
      expect(isDevelopment).toBeFalsy();
    });
  });

  describe("isProduction", () => {
    it('is true when NODE_ENV is "production"', async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBeTruthy();
    });

    it('is false when NODE_ENV is not "production"', async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBeFalsy();
    });

    it("is false when NODE_ENV is undefined", async () => {
      vi.stubEnv("NODE_ENV", "");
      const { isProduction } = await import("./runtime");
      expect(isProduction).toBeFalsy();
    });
  });

  describe("isServer", () => {
    it("isServer is true when window is undefined", async () => {
      // Passing undefined as the second argument unsets the value
      vi.stubGlobal("window", undefined);
      const { isServer } = await import("./runtime");
      expect(isServer).toBeTruthy();
    });

    it("isServer is false when window is defined", async () => {
      vi.stubGlobal("window", {});
      const { isServer } = await import("./runtime");
      expect(isServer).toBeFalsy();
    });
  });
});

import { QueryClient, environmentManager } from "@tanstack/react-query";
import { QUERY_CLIENT_CONFIG } from "./config/queryClientConfig";

describe("getQueryClient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    environmentManager.setIsServer(() => typeof window === "undefined");
  });

  describe("サーバー環境", () => {
    beforeEach(() => {
      environmentManager.setIsServer(() => true);
    });

    it("QueryClientインスタンスを返すこと", async () => {
      const { getQueryClient } = await import("./getQueryClient");
      expect(getQueryClient()).toBeInstanceOf(QueryClient);
    });

    it("呼び出すたびに新しいインスタンスを返すこと", async () => {
      const { getQueryClient } = await import("./getQueryClient");
      expect(getQueryClient()).not.toBe(getQueryClient());
    });

    it("QUERY_CLIENT_CONFIGのstaleTimeが適用されていること", async () => {
      const { getQueryClient } = await import("./getQueryClient");
      expect(getQueryClient().getDefaultOptions().queries?.staleTime).toBe(
        QUERY_CLIENT_CONFIG.defaultOptions.queries.staleTime,
      );
    });
  });

  describe("ブラウザ環境", () => {
    beforeEach(() => {
      environmentManager.setIsServer(() => false);
    });

    it("QueryClientインスタンスを返すこと", async () => {
      const { getQueryClient } = await import("./getQueryClient");
      expect(getQueryClient()).toBeInstanceOf(QueryClient);
    });

    it("複数回呼び出しても同じインスタンスを返すこと", async () => {
      const { getQueryClient } = await import("./getQueryClient");
      expect(getQueryClient()).toBe(getQueryClient());
    });

    it("QUERY_CLIENT_CONFIGのstaleTimeが適用されていること", async () => {
      const { getQueryClient } = await import("./getQueryClient");
      expect(getQueryClient().getDefaultOptions().queries?.staleTime).toBe(
        QUERY_CLIENT_CONFIG.defaultOptions.queries.staleTime,
      );
    });
  });
});

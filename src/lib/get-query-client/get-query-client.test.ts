import {
  QueryClient,
  environmentManager,
  queryOptions,
} from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryClientConfig } from "./config/query-client-config";

describe("getQueryClient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    environmentManager.setIsServer(() => typeof window === "undefined");
  });

  describe("on the server", () => {
    beforeEach(() => {
      environmentManager.setIsServer(() => true);
    });

    it("returns a QueryClient instance", async () => {
      const { getQueryClient } = await import("./get-query-client");
      expect(getQueryClient()).toBeInstanceOf(QueryClient);
    });

    it("returns a new instance on each call", async () => {
      const { getQueryClient } = await import("./get-query-client");
      expect(getQueryClient()).not.toBe(getQueryClient());
    });

    it("does not share the cache between requests", async () => {
      const { getQueryClient } = await import("./get-query-client");

      const { queryKey } = queryOptions({
        queryKey: ["user"],
        queryFn: () => "alice",
      });

      getQueryClient().setQueryData(queryKey, "alice");

      expect(getQueryClient().getQueryData(queryKey)).toBeUndefined();
    });

    it("applies the configured staleTime", async () => {
      const { getQueryClient } = await import("./get-query-client");
      expect(getQueryClient().getDefaultOptions().queries?.staleTime).toBe(
        createQueryClientConfig().defaultOptions.queries.staleTime
      );
    });
  });

  describe("in the browser", () => {
    beforeEach(() => {
      environmentManager.setIsServer(() => false);
    });

    it("returns a QueryClient instance", async () => {
      const { getQueryClient } = await import("./get-query-client");
      expect(getQueryClient()).toBeInstanceOf(QueryClient);
    });

    it("returns the same instance across calls", async () => {
      const { getQueryClient } = await import("./get-query-client");
      expect(getQueryClient()).toBe(getQueryClient());
    });

    it("applies the configured staleTime", async () => {
      const { getQueryClient } = await import("./get-query-client");
      expect(getQueryClient().getDefaultOptions().queries?.staleTime).toBe(
        createQueryClientConfig().defaultOptions.queries.staleTime
      );
    });
  });
});

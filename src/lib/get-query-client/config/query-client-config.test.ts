import type { MockInstance } from "vitest";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryClientConfig } from "./query-client-config";
import { loading } from "../../../components/loading-overlay";
import { errorNotifier } from "../../error-notifier";

// The target is a real Query built in the cache. Only its state is changed via setState.
function buildQuery(queryClient: QueryClient, name: string) {
  // shouldDehydrateQuery takes a Query whose queryKey is readonly unknown[].
  const queryKey: readonly unknown[] = [name];

  return queryClient.getQueryCache().build(queryClient, { queryKey });
}

describe("createQueryClientConfig", () => {
  const config = createQueryClientConfig();

  let queryClient: QueryClient;
  let notifySpy: MockInstance<(message: string) => void>;

  beforeEach(() => {
    queryClient = new QueryClient(createQueryClientConfig());
    notifySpy = vi.spyOn(errorNotifier, "notify").mockImplementation(() => {});
    loading.reset();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe("queryCache onError", () => {
    it("calls toast.error on error", async () => {
      await expect(
        queryClient.query({
          queryKey: ["test-error"],
          queryFn: async () => {
            await Promise.reject(new Error("fetch failed"));
          },
        })
      ).rejects.toThrow("fetch failed");

      expect(notifySpy).toHaveBeenCalledWith("fetch failed");
    });

    it("does not call toast.error when skipToast is true", async () => {
      await expect(
        queryClient.query({
          queryKey: ["test-skip"],
          queryFn: async () => {
            await Promise.reject(new Error("fetch failed"));
          },
          meta: { skipToast: true },
        })
      ).rejects.toThrow("fetch failed");

      expect(notifySpy).not.toHaveBeenCalled();
    });
  });

  describe("mutationCache loading", () => {
    it("calls loading.show / hide symmetrically while a mutation runs", async () => {
      const showSpy = vi.spyOn(loading, "show");
      const hideSpy = vi.spyOn(loading, "hide");

      await queryClient
        .getMutationCache()
        .build(queryClient, {
          mutationFn: async () => {
            await Promise.resolve();

            return "ok";
          },
        })
        // Mutation.execute requires variables
        .execute(undefined);

      expect(showSpy).toHaveBeenCalledOnce();
      expect(hideSpy).toHaveBeenCalledOnce();
    });

    it("calls loading.hide even when a mutation fails", async () => {
      const showSpy = vi.spyOn(loading, "show");
      const hideSpy = vi.spyOn(loading, "hide");

      await expect(
        queryClient
          .getMutationCache()
          .build(queryClient, {
            mutationFn: async () => {
              await Promise.reject(new Error("mutation failed"));
            },
          })
          // Mutation.execute requires variables
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(showSpy).toHaveBeenCalledOnce();
      expect(hideSpy).toHaveBeenCalledOnce();
    });

    it("does not call loading.show / hide when skipLoading is true", async () => {
      const showSpy = vi.spyOn(loading, "show");
      const hideSpy = vi.spyOn(loading, "hide");

      await queryClient
        .getMutationCache()
        .build(queryClient, {
          mutationFn: async () => {
            await Promise.resolve();

            return "ok";
          },
          meta: { skipLoading: true },
        })
        // Mutation.execute requires variables
        .execute(undefined);

      expect(showSpy).not.toHaveBeenCalled();
      expect(hideSpy).not.toHaveBeenCalled();
    });
  });

  describe("mutationCache onError", () => {
    it("calls toast.error on error", async () => {
      await expect(
        queryClient
          .getMutationCache()
          .build(queryClient, {
            mutationFn: async () => {
              await Promise.reject(new Error("mutation failed"));
            },
          })
          // Mutation.execute requires variables
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(notifySpy).toHaveBeenCalledWith("mutation failed");
    });

    it("does not call toast.error when skipToast is true", async () => {
      await expect(
        queryClient
          .getMutationCache()
          .build(queryClient, {
            mutationFn: async () => {
              await Promise.reject(new Error("mutation failed"));
            },
            meta: { skipToast: true },
          })
          // Mutation.execute requires variables
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(notifySpy).not.toHaveBeenCalled();
    });
  });

  describe("cache isolation", () => {
    it("creates a new QueryCache / MutationCache on each call", () => {
      const a = createQueryClientConfig();
      const b = createQueryClientConfig();

      expect(a.queryCache).not.toBe(b.queryCache);
      expect(a.mutationCache).not.toBe(b.mutationCache);
    });

    it("does not leak the cache into another QueryClient", () => {
      const other = new QueryClient(createQueryClientConfig());

      const { queryKey } = queryOptions({
        queryKey: ["isolated"],
        queryFn: () => "value",
      });

      queryClient.setQueryData(queryKey, "value");

      expect(other.getQueryData(queryKey)).toBeUndefined();
    });
  });

  describe("defaultOptions", () => {
    it("sets queries retry to false", () => {
      expect(config.defaultOptions.queries.retry).toBeFalsy();
    });

    it("sets mutations retry to false", () => {
      expect(config.defaultOptions.mutations.retry).toBeFalsy();
    });

    it("sets staleTime to 60 seconds", () => {
      expect(config.defaultOptions.queries.staleTime).toBe(60_000);
    });

    it("sets refetchOnWindowFocus to false", () => {
      expect(config.defaultOptions.queries.refetchOnWindowFocus).toBeFalsy();
    });
  });

  describe("dehydrate", () => {
    const { shouldDehydrateQuery } = config.defaultOptions.dehydrate;

    it("dehydrates queries with success status", () => {
      const query = buildQuery(queryClient, "dehydrate-success");
      query.setState({ status: "success", data: "value" });

      expect(shouldDehydrateQuery(query)).toBeTruthy();
    });

    it("dehydrates queries with pending status", () => {
      const query = buildQuery(queryClient, "dehydrate-pending");

      expect(query.state.status).toBe("pending");
      expect(shouldDehydrateQuery(query)).toBeTruthy();
    });

    it("does not dehydrate queries with error status", () => {
      const query = buildQuery(queryClient, "dehydrate-error");
      query.setState({ status: "error", error: new Error("failed") });

      expect(shouldDehydrateQuery(query)).toBeFalsy();
    });
  });
});

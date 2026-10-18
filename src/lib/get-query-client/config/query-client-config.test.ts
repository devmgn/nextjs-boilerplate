import type { MockInstance } from "vitest";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryClientConfig } from "./query-client-config";
import { loading } from "../../../components/loading-overlay";
import { errorNotifier } from "../../error-notifier";

// 判定対象はキャッシュに作った実物の Query。状態だけ setState で動かす。
function buildQuery(queryClient: QueryClient, name: string) {
  // shouldDehydrateQuery の引数は queryKey が readonly unknown[] の Query。
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
    it("エラー時にtoast.errorが呼ばれること", async () => {
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

    it("skipToast: trueのときtoast.errorが呼ばれないこと", async () => {
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
    it("mutation 実行中に loading.show / hide が対称に呼ばれること", async () => {
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
        // Mutation.execute は variables が必須引数
        // oxlint-disable-next-line unicorn/no-useless-undefined
        .execute(undefined);

      expect(showSpy).toHaveBeenCalledOnce();
      expect(hideSpy).toHaveBeenCalledOnce();
    });

    it("mutation 失敗時にも loading.hide が呼ばれること", async () => {
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
          // Mutation.execute は variables が必須引数
          // oxlint-disable-next-line unicorn/no-useless-undefined
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(showSpy).toHaveBeenCalledOnce();
      expect(hideSpy).toHaveBeenCalledOnce();
    });

    it("skipLoading: true のとき loading.show / hide が呼ばれないこと", async () => {
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
        // Mutation.execute は variables が必須引数
        // oxlint-disable-next-line unicorn/no-useless-undefined
        .execute(undefined);

      expect(showSpy).not.toHaveBeenCalled();
      expect(hideSpy).not.toHaveBeenCalled();
    });
  });

  describe("mutationCache onError", () => {
    it("エラー時にtoast.errorが呼ばれること", async () => {
      await expect(
        queryClient
          .getMutationCache()
          .build(queryClient, {
            mutationFn: async () => {
              await Promise.reject(new Error("mutation failed"));
            },
          })
          // Mutation.execute は variables が必須引数
          // oxlint-disable-next-line unicorn/no-useless-undefined
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(notifySpy).toHaveBeenCalledWith("mutation failed");
    });

    it("skipToast: trueのときtoast.errorが呼ばれないこと", async () => {
      await expect(
        queryClient
          .getMutationCache()
          .build(queryClient, {
            mutationFn: async () => {
              await Promise.reject(new Error("mutation failed"));
            },
            meta: { skipToast: true },
          })
          // Mutation.execute は variables が必須引数
          // oxlint-disable-next-line unicorn/no-useless-undefined
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(notifySpy).not.toHaveBeenCalled();
    });
  });

  describe("キャッシュの独立性", () => {
    it("呼び出すたびに新しい QueryCache / MutationCache を作ること", () => {
      const a = createQueryClientConfig();
      const b = createQueryClientConfig();

      expect(a.queryCache).not.toBe(b.queryCache);
      expect(a.mutationCache).not.toBe(b.mutationCache);
    });

    it("別の QueryClient にキャッシュが漏れないこと", () => {
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
    it("queriesのretryがfalseであること", () => {
      expect(config.defaultOptions.queries.retry).toBeFalsy();
    });

    it("mutationsのretryがfalseであること", () => {
      expect(config.defaultOptions.mutations.retry).toBeFalsy();
    });

    it("staleTimeが60秒であること", () => {
      expect(config.defaultOptions.queries.staleTime).toBe(60_000);
    });

    it("refetchOnWindowFocusがfalseであること", () => {
      expect(config.defaultOptions.queries.refetchOnWindowFocus).toBeFalsy();
    });
  });

  describe("dehydrate", () => {
    const { shouldDehydrateQuery } = config.defaultOptions.dehydrate;

    it("successステータスのクエリがdehydrate対象であること", () => {
      const query = buildQuery(queryClient, "dehydrate-success");
      query.setState({ status: "success", data: "value" });

      expect(shouldDehydrateQuery(query)).toBeTruthy();
    });

    it("pendingステータスのクエリがdehydrate対象であること", () => {
      const query = buildQuery(queryClient, "dehydrate-pending");

      expect(query.state.status).toBe("pending");
      expect(shouldDehydrateQuery(query)).toBeTruthy();
    });

    it("errorステータスのクエリがdehydrate対象外であること", () => {
      const query = buildQuery(queryClient, "dehydrate-error");
      query.setState({ status: "error", error: new Error("failed") });

      expect(shouldDehydrateQuery(query)).toBeFalsy();
    });
  });
});

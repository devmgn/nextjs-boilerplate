import type { MockInstance } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QUERY_CLIENT_CONFIG } from "./query-client-config";
import { loading } from "../../../components/loading-overlay";
import { errorNotifier } from "../../error-notifier";

describe("QUERY_CLIENT_CONFIG", () => {
  let queryClient: QueryClient;
  let notifySpy: MockInstance<(message: string) => void>;

  beforeEach(() => {
    queryClient = new QueryClient(QUERY_CLIENT_CONFIG);
    notifySpy = vi.spyOn(errorNotifier, "notify").mockImplementation(() => {});
    loading.reset();
  });

  afterEach(() => {
    notifySpy.mockRestore();
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
          .execute(undefined)
      ).rejects.toThrow("mutation failed");

      expect(notifySpy).not.toHaveBeenCalled();
    });
  });

  describe("defaultOptions", () => {
    it("queriesのretryがfalseであること", () => {
      expect(QUERY_CLIENT_CONFIG.defaultOptions.queries.retry).toBeFalsy();
    });

    it("mutationsのretryがfalseであること", () => {
      expect(QUERY_CLIENT_CONFIG.defaultOptions.mutations.retry).toBeFalsy();
    });

    it("staleTimeが60秒であること", () => {
      expect(QUERY_CLIENT_CONFIG.defaultOptions.queries.staleTime).toBe(60_000);
    });

    it("refetchOnWindowFocusがfalseであること", () => {
      expect(
        QUERY_CLIENT_CONFIG.defaultOptions.queries.refetchOnWindowFocus
      ).toBeFalsy();
    });
  });

  describe("dehydrate", () => {
    const { shouldDehydrateQuery } =
      QUERY_CLIENT_CONFIG.defaultOptions.dehydrate;

    // 手で組んだ部分オブジェクトを Query に見せかけるのではなく、
    // キャッシュに実物を作って状態だけ動かす。
    const buildQuery = (name: string) => {
      // shouldDehydrateQuery の引数は queryKey が readonly unknown[] の Query。
      const queryKey: readonly unknown[] = [name];
      return queryClient.getQueryCache().build(queryClient, { queryKey });
    };

    it("successステータスのクエリがdehydrate対象であること", () => {
      const query = buildQuery("dehydrate-success");
      query.setState({ status: "success", data: "value" });

      expect(shouldDehydrateQuery(query)).toBeTruthy();
    });

    it("pendingステータスのクエリがdehydrate対象であること", () => {
      const query = buildQuery("dehydrate-pending");

      expect(query.state.status).toBe("pending");
      expect(shouldDehydrateQuery(query)).toBeTruthy();
    });

    it("errorステータスのクエリがdehydrate対象外であること", () => {
      const query = buildQuery("dehydrate-error");
      query.setState({ status: "error", error: new Error("failed") });

      expect(shouldDehydrateQuery(query)).toBeFalsy();
    });
  });
});

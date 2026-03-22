import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_CLIENT_CONFIG } from "./queryClientConfig";

// @ts-expect-error -- TypeScript 6 overload mismatch with vi.mock + dynamic import
vi.mock(import("sonner"), () => ({
  toast: { error: vi.fn() },
}));

describe("QUERY_CLIENT_CONFIG", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient(QUERY_CLIENT_CONFIG);
    vi.mocked(toast.error).mockClear();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe("queryCache onError", () => {
    it("エラー時にtoast.errorが呼ばれること", async () => {
      await queryClient
        .fetchQuery({
          queryKey: ["test-error"],
          queryFn: async () => {
            await Promise.reject(new Error("fetch failed"));
          },
        })
        .catch(() => {});

      expect(toast.error).toHaveBeenCalledWith("fetch failed");
    });

    it("skipToast: trueのときtoast.errorが呼ばれないこと", async () => {
      await queryClient
        .fetchQuery({
          queryKey: ["test-skip"],
          queryFn: async () => {
            await Promise.reject(new Error("fetch failed"));
          },
          meta: { skipToast: true },
        })
        .catch(() => {});

      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe("mutationCache onError", () => {
    it("エラー時にtoast.errorが呼ばれること", async () => {
      await queryClient
        .getMutationCache()
        .build(queryClient, {
          mutationFn: async () => {
            await Promise.reject(new Error("mutation failed"));
          },
        })
        .execute(undefined)
        .catch(() => {});

      expect(toast.error).toHaveBeenCalledWith("mutation failed");
    });

    it("skipToast: trueのときtoast.errorが呼ばれないこと", async () => {
      await queryClient
        .getMutationCache()
        .build(queryClient, {
          mutationFn: async () => {
            await Promise.reject(new Error("mutation failed"));
          },
          meta: { skipToast: true },
        })
        .execute(undefined)
        .catch(() => {});

      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe("defaultOptions", () => {
    it("queriesのretryがfalseであること", () => {
      expect(QUERY_CLIENT_CONFIG.defaultOptions.queries.retry).toBe(false);
    });

    it("mutationsのretryがfalseであること", () => {
      expect(QUERY_CLIENT_CONFIG.defaultOptions.mutations.retry).toBe(false);
    });

    it("staleTimeが60秒であること", () => {
      expect(QUERY_CLIENT_CONFIG.defaultOptions.queries.staleTime).toBe(60_000);
    });

    it("refetchOnWindowFocusがfalseであること", () => {
      expect(
        QUERY_CLIENT_CONFIG.defaultOptions.queries.refetchOnWindowFocus,
      ).toBe(false);
    });
  });

  describe("dehydrate", () => {
    it("successステータスのクエリがdehydrate対象であること", () => {
      const { shouldDehydrateQuery } =
        QUERY_CLIENT_CONFIG.defaultOptions.dehydrate;
      const query = { state: { status: "success" } } as Parameters<
        typeof shouldDehydrateQuery
      >[0];

      expect(shouldDehydrateQuery(query)).toBe(true);
    });

    it("pendingステータスのクエリがdehydrate対象であること", () => {
      const { shouldDehydrateQuery } =
        QUERY_CLIENT_CONFIG.defaultOptions.dehydrate;
      const query = { state: { status: "pending" } } as Parameters<
        typeof shouldDehydrateQuery
      >[0];

      expect(shouldDehydrateQuery(query)).toBe(true);
    });

    it("errorステータスのクエリがdehydrate対象外であること", () => {
      const { shouldDehydrateQuery } =
        QUERY_CLIENT_CONFIG.defaultOptions.dehydrate;
      const query = { state: { status: "error" } } as Parameters<
        typeof shouldDehydrateQuery
      >[0];

      expect(shouldDehydrateQuery(query)).toBe(false);
    });
  });
});

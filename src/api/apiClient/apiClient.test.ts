import { HttpResponse, http } from "msw";
import { apiClient } from "./apiClient";
import { server } from "../../mocks/server";

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("apiClient", () => {
  describe("listPosts", () => {
    it("投稿一覧を取得できること", async () => {
      const mockPosts = [{ userId: 1, id: 1, title: "タイトル", body: "本文" }];
      server.use(
        http.get(`${BASE_URL}/posts`, () => HttpResponse.json(mockPosts)),
      );

      const result = await apiClient.listPosts();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 1, title: "タイトル" });
    });

    it("クエリパラメータが送信されること", async () => {
      server.use(
        http.get(`${BASE_URL}/posts`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("userId")).toBe("1");
          expect(url.searchParams.get("title")).toBe("検索");
          return HttpResponse.json([]);
        }),
      );

      await apiClient.listPosts({ userId: 1, title: "検索" });
    });
  });

  describe("postsPost", () => {
    it("投稿を作成できること", async () => {
      const newPost = { userId: 1, title: "新規投稿", body: "内容" };
      server.use(
        http.post(`${BASE_URL}/posts`, async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json({ ...body, id: 101 }, { status: 201 });
        }),
      );

      const result = await apiClient.postsPost({ post: newPost });

      expect(result).toMatchObject({ id: 101, title: "新規投稿" });
    });
  });

  describe("postsPostIdGet", () => {
    it("IDで投稿を取得できること", async () => {
      const mockPost = { userId: 1, id: 42, title: "個別投稿", body: "本文" };
      server.use(
        http.get(`${BASE_URL}/posts/:postId`, ({ params }) => {
          expect(params.postId).toBe("42");
          return HttpResponse.json(mockPost);
        }),
      );

      const result = await apiClient.postsPostIdGet({ postId: 42 });

      expect(result).toMatchObject({ id: 42, title: "個別投稿" });
    });

    it("404の場合に例外がスローされること", async () => {
      server.use(
        http.get(`${BASE_URL}/posts/:postId`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(apiClient.postsPostIdGet({ postId: 999 })).rejects.toThrow();
    });
  });

  describe("postsPostIdPatch", () => {
    it("投稿を更新できること", async () => {
      server.use(
        http.patch(`${BASE_URL}/posts/:postId`, async ({ params, request }) => {
          const body = (await request.json()) as Record<string, unknown>;
          expect(params.postId).toBe("1");
          return HttpResponse.json({ ...body, id: 1 });
        }),
      );

      const result = await apiClient.postsPostIdPatch({
        postId: 1,
        post: { title: "更新済み" },
      });

      expect(result).toMatchObject({ id: 1, title: "更新済み" });
    });
  });

  describe("postsPostIdDelete", () => {
    it("投稿を削除できること", async () => {
      server.use(
        http.delete(`${BASE_URL}/posts/:postId`, ({ params }) => {
          expect(params.postId).toBe("1");
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await expect(
        apiClient.postsPostIdDelete({ postId: 1 }),
      ).resolves.toBeUndefined();
    });

    it("500の場合に例外がスローされること", async () => {
      server.use(
        http.delete(`${BASE_URL}/posts/:postId`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        apiClient.postsPostIdDelete({ postId: 1 }),
      ).rejects.toThrow();
    });
  });
});

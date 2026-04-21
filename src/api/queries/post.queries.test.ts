import { QueryClient } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";
import { getPostsQueryOptions } from "./post.queries";
import { server } from "../../mocks/server";
import { ResponseError } from "../openapi";

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("getPostsQueryOptions", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("投稿一覧を取得できること", async () => {
    const mockPosts = [
      { userId: 1, id: 1, title: "タイトル1", body: "本文1" },
      { userId: 1, id: 2, title: "タイトル2", body: "本文2" },
    ];
    server.use(
      http.get(`${BASE_URL}/posts`, () => HttpResponse.json(mockPosts)),
    );

    const result = await queryClient.fetchQuery(getPostsQueryOptions());

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      userId: 1,
      id: 1,
      title: "タイトル1",
    });
  });

  it("userIdでフィルタリングできること", async () => {
    const mockPosts = [
      { userId: 2, id: 3, title: "ユーザー2の投稿", body: "本文" },
    ];
    server.use(
      http.get(`${BASE_URL}/posts`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("userId")).toBe("2");
        return HttpResponse.json(mockPosts);
      }),
    );

    const result = await queryClient.fetchQuery(
      getPostsQueryOptions({ userId: 2 }),
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.userId).toBe(2);
  });

  it("queryKeyにリクエストパラメータが含まれること", () => {
    const options = getPostsQueryOptions({ userId: 1 });

    expect(options.queryKey).toStrictEqual(["getPosts", { userId: 1 }]);
  });

  it("パラメータなしのqueryKeyが正しいこと", () => {
    const options = getPostsQueryOptions();

    expect(options.queryKey).toStrictEqual(["getPosts", {}]);
  });

  it("APIエラー時に例外がスローされること", async () => {
    server.use(
      http.get(`${BASE_URL}/posts`, () =>
        HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );

    await expect(
      queryClient.fetchQuery(getPostsQueryOptions()),
    ).rejects.toThrow(ResponseError);
  });

  it("空配列が返された場合に正しく処理されること", async () => {
    server.use(http.get(`${BASE_URL}/posts`, () => HttpResponse.json([])));

    const result = await queryClient.fetchQuery(getPostsQueryOptions());

    expect(result).toStrictEqual([]);
  });
});

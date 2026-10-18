import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { ApiError, apiClient, isApiError } from "./api-client";
import { server } from "../../mocks/server";

// 生成コード（spec）に依存させず、mutator 単体の振る舞いだけを検証する
const URL = "https://api.example.test/resource";

describe("apiClient", () => {
  describe("成功応答", () => {
    it("JSON の本文を parse して返すこと", async () => {
      server.use(http.get(URL, () => HttpResponse.json({ id: 1, name: "a" })));

      await expect(apiClient(URL)).resolves.toStrictEqual({
        id: 1,
        name: "a",
      });
    });

    it("204 の場合に undefined を返すこと", async () => {
      server.use(
        http.delete(URL, () => new HttpResponse(null, { status: 204 }))
      );

      await expect(
        apiClient(URL, { method: "DELETE" })
      ).resolves.toBeUndefined();
    });

    it("本文が空の場合に undefined を返すこと", async () => {
      server.use(
        http.delete(URL, () => new HttpResponse(null, { status: 200 }))
      );

      await expect(
        apiClient(URL, { method: "DELETE" })
      ).resolves.toBeUndefined();
    });

    it("2xx でも JSON として読めない場合に ApiError をスローすること", async () => {
      server.use(
        http.get(URL, () => HttpResponse.html("<html>proxy error</html>"))
      );

      await expect(apiClient(URL)).rejects.toBeInstanceOf(ApiError);
      await expect(apiClient(URL)).rejects.toMatchObject({
        status: 200,
        body: "<html>proxy error</html>",
      });
    });
  });

  describe("エラー応答", () => {
    it.each([400, 404, 500])(
      "%i の場合に status と本文を持つ ApiError をスローすること",
      async (status) => {
        server.use(
          http.get(URL, () =>
            HttpResponse.json({ message: "error" }, { status })
          )
        );

        await expect(apiClient(URL)).rejects.toBeInstanceOf(ApiError);
        await expect(apiClient(URL)).rejects.toMatchObject({
          name: "ApiError",
          status,
          body: JSON.stringify({ message: "error" }),
        });
      }
    );
  });

  describe("エラー応答の本文が読めない場合", () => {
    it("status を保ったまま本文を空として ApiError をスローすること", async () => {
      // 本文の受信途中で接続が切れた状況は MSW では作れないため、fetch を直接差し替える
      const brokenBody = new ReadableStream({
        start(controller) {
          controller.error(new TypeError("terminated"));
        },
      });

      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(brokenBody, { status: 503 })
      );

      await expect(apiClient(URL)).rejects.toMatchObject({
        name: "ApiError",
        status: 503,
        body: "",
      });
    });
  });

  describe("リクエスト", () => {
    it("RequestInit の method・headers・body をそのまま渡すこと", async () => {
      server.use(
        http.post(URL, async ({ request }) => {
          expect(request.headers.get("Content-Type")).toBe("application/json");

          return HttpResponse.json(await request.json(), { status: 201 });
        })
      );

      await expect(
        apiClient(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "t" }),
        })
      ).resolves.toStrictEqual({ title: "t" });
    });

    it("signal で中断できること", async () => {
      server.use(http.get(URL, () => HttpResponse.json({})));
      const controller = new AbortController();
      controller.abort();

      await expect(
        apiClient(URL, { signal: controller.signal })
      ).rejects.toMatchObject({ name: "AbortError" });
    });
  });
});

describe("isApiError", () => {
  it("ApiError のインスタンスを true と判定すること", () => {
    const error = new ApiError(new Response(null, { status: 404 }), "");

    expect(isApiError(error)).toBeTruthy();
  });

  it("別の ApiError クラス由来でも name・status・body が揃えば true と判定すること", () => {
    const error = Object.assign(new Error("x"), {
      name: "ApiError",
      status: 500,
      body: "",
    });

    expect(isApiError(error)).toBeTruthy();
  });

  it.each([
    ["通常の Error", new Error("x")],
    [
      "name だけ一致する Error",
      Object.assign(new Error("x"), { name: "ApiError" }),
    ],
    ["Error でないオブジェクト", { name: "ApiError", status: 500, body: "" }],
    ["null", null],
  ])("%s を false と判定すること", (_label, value) => {
    expect(isApiError(value)).toBeFalsy();
  });
});

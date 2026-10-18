// @vitest-environment node
// server action は Node.js で動くため、fetch の失敗時の挙動（TypeError）も Node.js に合わせる
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { createArticle } from "./create-article";
import { getCreateArticleUrl } from "../../../../../api/openapi/articles/articles";
import {
  defineFixtures,
  respond,
} from "../../../../../api/openapi/index.fixtures";
import { createFixtureHandler } from "../../../../../mocks/fixture-handler";
import { server } from "../../../../../mocks/server";

const input = {
  title: "Title",
  description: "Description",
  body: "Body",
  tags: " react, , nextjs ",
};

describe("createArticle", () => {
  it("タグを配列に変換して送信し、成功時に slug を返すこと", async () => {
    let received: unknown;
    server.use(
      createFixtureHandler(
        defineFixtures({
          "POST /api/articles": ({ body }) => {
            received = body;

            return { article: { slug: "title-1" } };
          },
        })
      )
    );

    await expect(createArticle(null, input)).resolves.toStrictEqual({
      ok: true,
      message: "Created: title-1",
    });
    expect(received).toStrictEqual({
      article: {
        title: "Title",
        description: "Description",
        body: "Body",
        tagList: ["react", "nextjs"],
      },
    });
  });

  it("401 の場合にログインが必要な旨の失敗状態を返すこと", async () => {
    server.use(
      createFixtureHandler(
        defineFixtures({
          "POST /api/articles": respond(401, {
            errors: { token: ["is missing"] },
          }),
        })
      )
    );

    await expect(createArticle(null, input)).resolves.toStrictEqual({
      ok: false,
      message: "Login required",
    });
  });

  // spec にない応答（HTML のエラーページ・通信エラー）は fixtures で表せないため素の handler で作る
  it("上流の応答本文を画面向けのメッセージに含めないこと", async () => {
    server.use(
      http.post(getCreateArticleUrl(), () =>
        HttpResponse.html("<html>internal stack trace</html>", { status: 502 })
      )
    );

    await expect(createArticle(null, input)).resolves.toStrictEqual({
      ok: false,
      message: "Request failed (502)",
    });
  });

  it("通信エラーの場合に失敗状態を返すこと", async () => {
    server.use(http.post(getCreateArticleUrl(), () => HttpResponse.error()));

    await expect(createArticle(null, input)).resolves.toStrictEqual({
      ok: false,
      message: "Network error",
    });
  });

  it.each([
    ["title が空", { ...input, title: "" }],
    ["tags が欠けている", { title: "T", description: "D", body: "B" }],
  ])("%s 場合に API を呼ばず失敗状態を返すこと", async (_label, data) => {
    // API が呼ばれたら MSW の onUnhandledFrame でテストが落ちる
    // SAFETY: 検証を通らない値を意図的に渡す
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const state = await createArticle(null, data as typeof input);

    expect(state).toStrictEqual({ ok: false, message: "Invalid input" });
  });
});

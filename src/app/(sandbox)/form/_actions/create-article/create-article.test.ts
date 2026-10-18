// @vitest-environment node
// Server actions run on Node.js, so fetch failure behavior (TypeError) follows Node.js too
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
  it("sends tags as an array and returns the slug on success", async () => {
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

  it("returns a login-required failure on 401", async () => {
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

  // Responses outside the spec (HTML error pages, network errors) can't be expressed with fixtures, so use raw handlers
  it("does not include the upstream response body in the UI message", async () => {
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

  it("returns a failure on network errors", async () => {
    server.use(http.post(getCreateArticleUrl(), () => HttpResponse.error()));

    await expect(createArticle(null, input)).resolves.toStrictEqual({
      ok: false,
      message: "Network error",
    });
  });

  it.each([
    ["title is empty", { ...input, title: "" }],
    ["tags is missing", { title: "T", description: "D", body: "B" }],
  ])(
    "returns a failure without calling the API when %s",
    async (_label, data) => {
      // If the API is called, MSW's onUnhandledFrame fails the test
      // SAFETY: intentionally passes values that fail validation
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const state = await createArticle(null, data as typeof input);

      expect(state).toStrictEqual({ ok: false, message: "Invalid input" });
    }
  );
});

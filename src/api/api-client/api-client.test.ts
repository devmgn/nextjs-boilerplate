import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { ApiError, apiClient, isApiError } from "./api-client";
import { server } from "../../mocks/server";

// Tests only the mutator's own behavior, without depending on the generated code (spec)
const URL = "https://api.example.test/resource";

describe("apiClient", () => {
  describe("successful responses", () => {
    it("parses and returns the JSON body", async () => {
      server.use(http.get(URL, () => HttpResponse.json({ id: 1, name: "a" })));

      await expect(apiClient(URL)).resolves.toStrictEqual({
        id: 1,
        name: "a",
      });
    });

    it("returns undefined for 204", async () => {
      server.use(
        http.delete(URL, () => new HttpResponse(null, { status: 204 }))
      );

      await expect(
        apiClient(URL, { method: "DELETE" })
      ).resolves.toBeUndefined();
    });

    it("returns undefined when the body is empty", async () => {
      server.use(
        http.delete(URL, () => new HttpResponse(null, { status: 200 }))
      );

      await expect(
        apiClient(URL, { method: "DELETE" })
      ).resolves.toBeUndefined();
    });

    it("throws ApiError for a 2xx response that cannot be read as JSON", async () => {
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

  describe("error responses", () => {
    it.each([400, 404, 500])(
      "throws ApiError with status and body for %i",
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

  describe("when the error response body cannot be read", () => {
    it("throws ApiError with the status kept and an empty body", async () => {
      // MSW cannot simulate a connection dropping mid-body, so replace fetch directly
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

  describe("requests", () => {
    it("passes RequestInit method, headers, and body through as-is", async () => {
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

    it("can be aborted with a signal", async () => {
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
  it("returns true for an ApiError instance", () => {
    const error = new ApiError(new Response(null, { status: 404 }), "");

    expect(isApiError(error)).toBeTruthy();
  });

  it("returns true for another ApiError class when name, status, and body are present", () => {
    const error = Object.assign(new Error("x"), {
      name: "ApiError",
      status: 500,
      body: "",
    });

    expect(isApiError(error)).toBeTruthy();
  });

  it.each([
    ["a plain Error", new Error("x")],
    [
      "an Error matching only name",
      Object.assign(new Error("x"), { name: "ApiError" }),
    ],
    ["a non-Error object", { name: "ApiError", status: 500, body: "" }],
    ["null", null],
  ])("returns false for %s", (_label, value) => {
    expect(isApiError(value)).toBeFalsy();
  });
});

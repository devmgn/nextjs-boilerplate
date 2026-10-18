import type { FixtureSet } from "../api/openapi/index.fixtures";
import { HttpResponse, http } from "msw";
import { resolveFixture } from "../api/openapi/index.fixtures";

/**
 * Turns Orval-generated fixtures (`defineFixtures`) into an MSW handler.
 * Requests that match no fixture return nothing and fall through to the next
 * handler (or are treated as unhandled if there is none).
 *
 * @param fixtures - The set of fixtures defined with `defineFixtures`
 * @returns An MSW handler that receives every request and responds when it
 *   matches a fixture
 */
export function createFixtureHandler(fixtures: FixtureSet) {
  // MSW treats undefined as "not handled by this handler" and moves on, so return either a response or undefined
  /* oxlint-disable typescript/consistent-return, sonarjs/no-inconsistent-returns */
  return http.all("*", async ({ request }) => {
    const isJson = (request.headers.get("Content-Type") ?? "").includes(
      "application/json"
    );

    const text = isJson ? await request.clone().text() : "";
    const body: unknown = text === "" ? undefined : JSON.parse(text);

    const result = resolveFixture(fixtures, {
      method: request.method,
      url: request.url,
      body,
    });

    if (!result) {
      return;
    }

    const init = { status: result.status, headers: result.headers };

    // Responses without a body such as 204 (routes with no body in the spec)
    if (result.body === undefined) {
      return new HttpResponse(null, init);
    }

    return HttpResponse.json(result.body, init);
  });
  /* oxlint-enable typescript/consistent-return, sonarjs/no-inconsistent-returns */
}

import type { FixtureSet } from "../api/openapi/index.fixtures";
import { HttpResponse, http } from "msw";
import { resolveFixture } from "../api/openapi/index.fixtures";

/**
 * Orval 生成の fixtures（`defineFixtures`）を MSW の handler にする。
 * fixture に一致しないリクエストは何も返さず、後続の handler（なければ未処理扱い）に回す。
 */
export function createFixtureHandler(fixtures: FixtureSet) {
  // MSW は undefined を「この handler では扱わない」として次へ回すため、応答と undefined を返し分ける
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

    // 204 など本文なしの応答（spec 上 body のない route）
    if (result.body === undefined) {
      return new HttpResponse(null, init);
    }

    return HttpResponse.json(result.body, init);
  });
  /* oxlint-enable typescript/consistent-return, sonarjs/no-inconsistent-returns */
}

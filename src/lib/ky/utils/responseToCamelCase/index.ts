import { camelCase } from "change-case/keys";
import type { KyRequest, KyResponse, NormalizedOptions } from "ky";

/**
 * KyのafterResponse Hookでレスポンスのキーをキャメルケースに変換する
 */
export const responseToCamelCase = async (
  _request: KyRequest,
  _options: NormalizedOptions,
  response: KyResponse,
) => {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return;
  }

  try {
    const body = await response.json();
    return new Response(
      JSON.stringify(camelCase(body, Number.POSITIVE_INFINITY)),
      response,
    );
  } catch (error) {
    console.error("Response body is not a valid JSON:", error);
    return;
  }
};

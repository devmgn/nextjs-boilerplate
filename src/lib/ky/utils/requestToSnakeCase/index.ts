import { snakeCase } from "change-case/keys";
import type { KyRequest, NormalizedOptions } from "ky";

/**
 * KyのbeforeRequest Hookでレスポンスのキーをスネークケースに変換する
 */
export const requestToSnakeCase = (
  request: KyRequest,
  options: NormalizedOptions,
) => {
  const contentType = request.headers.get("content-type");

  if (
    typeof options.body !== "string" ||
    !contentType?.includes("application/json")
  ) {
    return;
  }

  try {
    const body = JSON.parse(options.body);
    return new Request(request, {
      ...options,
      body: JSON.stringify(snakeCase(body, Number.POSITIVE_INFINITY)),
    });
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return;
  }
};

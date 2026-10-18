/** 2xx 以外の応答や JSON として読めない応答を表すエラー。 */
export class ApiError extends Error {
  readonly status: number;
  /** レスポンス本文の生テキスト。エラー形式は API ごとに異なるため parse しない。 */
  readonly body: string;

  /**
   * @param response - 失敗した応答。ステータスとメッセージの生成に使う
   * @param body - レスポンス本文の生テキスト
   * @param message - エラーメッセージ。省略時はステータスから生成する
   */
  constructor(response: Response, body: string, message?: string) {
    super(
      message ?? `API request failed: ${response.status} ${response.statusText}`
    );
    this.name = "ApiError";
    this.status = response.status;
    this.body = body;
  }
}

/**
 * `ApiError` かどうかを判定する。
 * bundle の重複などで `ApiError` クラスが複数読み込まれると `instanceof` が偽になるため、
 * `name` と `status` による構造的な判定も併用する。
 *
 * @param error - 判定対象の値
 * @returns `error` が `ApiError` とみなせるなら `true`
 */
export function isApiError(error: unknown): error is ApiError {
  if (error instanceof ApiError) {
    return true;
  }

  if (!(error instanceof Error) || error.name !== "ApiError") {
    return false;
  }

  return (
    "status" in error &&
    typeof error.status === "number" &&
    "body" in error &&
    typeof error.body === "string"
  );
}

/** Orval が生成する query / mutation の `TError` に使われる。 */
export type ErrorType<_Error> = ApiError;

/**
 * エラー応答の本文を読む。途中で失敗しても、ステータスを持った ApiError にするため空文字で代替する。
 *
 * @param response - 失敗した応答
 * @returns 本文のテキスト。読み取りに失敗した場合は空文字
 */
async function readErrorBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

const NO_CONTENT_STATUSES = new Set([204, 205]);

/**
 * Orval が生成する API 関数の mutator。
 * TanStack Query の error 状態に乗せるため、2xx 以外と JSON として読めない応答は `ApiError` を throw し、
 * 成功時は body のみ返す。
 *
 * @typeParam T - 応答本文の型 (OpenAPI spec から生成)
 * @param url - リクエスト先 URL
 * @param init - `fetch` に渡すリクエスト設定
 * @returns JSON として parse した応答本文。本文なしの成功応答では `undefined`
 */
export async function apiClient<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new ApiError(response, await readErrorBody(response));
  }

  const text = await response.text();

  // T は OpenAPI spec から生成された応答型。ランタイム検証のコストを避けるため、spec を契約として信頼し検証しない。
  if (NO_CONTENT_STATUSES.has(response.status) || text === "") {
    // SAFETY: 本文なしの成功応答は spec 上 void の操作（delete など）に限られる。
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return undefined as T;
  }

  try {
    // SAFETY: 応答の形は spec（= T）を契約として信頼する。
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(response, text, "API response is not valid JSON");
  }
}

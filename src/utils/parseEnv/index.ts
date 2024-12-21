import type { ValueOf } from "type-fest";

interface ParseEnvOptions {
  asNumber?: true;
  asBoolean?: true;
  asNull?: true;
}

type Env = ValueOf<NodeJS.ProcessEnv>;

/**
 * 環境変数の値を取得する関数
 *
 * @param {Env} env - 取得したい環境変数
 * @param {Object} [options] - 環境変数の解析オプション
 * @param {boolean} [options.asNumber] - trueなら、値を数値として解析
 * @param {boolean} [options.asBoolean] - trueなら、値を真偽値として解析
 * @param {boolean} [options.asNull] - trueなら、値をnullとして解析
 *
 * @returns {string|number|boolean|null} 環境変数の値
 * - オプションなしの場合は文字列で返す
 * - asNumberがtrueなら数値で返す
 * - asBooleanがtrueなら真偽値で返す
 * - asNullがtrueならnullで返す
 *
 * @throws {Error} 環境変数が定義されていないときにエラーを投げる
 * @throws {Error} asNumberがtrueで、値が有効な数値じゃないときにエラーを投げる
 * @throws {Error} asBooleanがtrueで、値が有効な真偽値じゃないときにエラーを投げる
 *
 * @example
 * // 文字列値を取得
 * const apiUrl = parseEnv(process.env.NEXT_PUBLIC_API_URL);
 *
 * // 数値を取得
 * const port = parseEnv(process.env.NEXT_PUBLIC_PORT, { asNumber: true });
 *
 * // 真偽値を取得
 * const debugMode = parseEnv(process.env.NEXT_PUBLIC_DEBUG_MODE, { asBoolean: true });
 */
export function parseEnv(env: Env, options: { asNumber: true }): number;
export function parseEnv(env: Env, options: { asBoolean: true }): boolean;
export function parseEnv(env: Env, options: { asNull: true }): boolean;
export function parseEnv(env: Env): string;

export function parseEnv(env: Env, options: ParseEnvOptions = {}) {
  const { asNumber, asBoolean, asNull } = options;

  if (env === undefined) {
    throw new Error("Environment variable is not defined");
  }

  if (asNumber) {
    const numberedValue = Number(env);
    if (Number.isNaN(numberedValue)) {
      throw new Error("Environment variable is not a valid number");
    }
    return numberedValue;
  }

  if (asBoolean) {
    const lowerValue = env.toLowerCase();
    if (lowerValue === "true") {
      return true;
    }
    if (lowerValue === "false") {
      return false;
    }
    throw new Error("Environment variable is not a valid boolean");
  }

  if (asNull) {
    return null;
  }

  return env;
}

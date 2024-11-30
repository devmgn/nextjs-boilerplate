import type { EnvKey } from "@/config";

interface GetEnvOptions {
  asNumber?: boolean;
  asBoolean?: boolean;
}

/**
 * 環境変数の値を取得する関数
 *
 * @param {EnvKey} key - 取得したい環境変数のキー
 * @param {Object} [options] - 環境変数の解析オプション
 * @param {boolean} [options.asNumber] - trueなら、値を数値として解析
 * @param {boolean} [options.asBoolean] - trueなら、値を真偽値として解析
 *
 * @returns {string|number|boolean} 環境変数の値
 * - オプションなしの場合は文字列で返す
 * - asNumberがtrueなら数値で返す
 * - asBooleanがtrueなら真偽値で返す
 *
 * @throws {Error} 環境変数が定義されていないときにエラーを投げる
 * @throws {Error} asNumberがtrueで、値が有効な数値じゃないときにエラーを投げる
 * @throws {Error} asBooleanがtrueで、値が有効な真偽値じゃないときにエラーを投げる
 *
 * @example
 * // 文字列値を取得
 * const apiUrl = getEnv('API_URL');
 *
 * // 数値を取得
 * const port = getEnv('PORT', { asNumber: true });
 *
 * // 真偽値を取得
 * const debugMode = getEnv('DEBUG_MODE', { asBoolean: true });
 */
export function getEnv(key: EnvKey, options: { asNumber: true }): number;
export function getEnv(key: EnvKey, options: { asBoolean: true }): boolean;
export function getEnv(key: EnvKey): string;

export function getEnv(
  key: EnvKey,
  { asNumber, asBoolean }: GetEnvOptions = {},
) {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  if (asNumber) {
    const numberedValue = Number(value);
    if (Number.isNaN(numberedValue)) {
      throw new Error(`Environment variable ${key} is not a valid number`);
    }
    return numberedValue;
  }

  if (asBoolean) {
    const lowerValue = value.toLowerCase();
    if (lowerValue === "true") {
      return true;
    }
    if (lowerValue === "false") {
      return false;
    }
    throw new Error(`Environment variable ${key} is not a valid boolean`);
  }

  return value;
}

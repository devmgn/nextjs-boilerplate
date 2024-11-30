import type { ENV_KEY } from "@/config";
import type { ValueOf } from "type-fest";

type EnvKey = ValueOf<typeof ENV_KEY>;

interface GetEnvOptions {
  asNumber?: boolean;
  asBoolean?: boolean;
}

/**
 * 環境変数を取得する
 * @param key 環境変数のキー
 * @param options オプション
 * @returns 環境変数の値
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

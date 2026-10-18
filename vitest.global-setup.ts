import { loadEnvConfig } from "@next/env";

/** Vitest 全体の前処理。`.env` を読み込み、タイムゾーンを固定する。 */
export default function config() {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
}

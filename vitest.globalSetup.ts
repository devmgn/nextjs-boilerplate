import { loadEnvConfig } from "@next/env";

// biome-ignore lint/style/noDefaultExport: use default export
export default function config() {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
  process.env.LANG = "ja_JP.UTF-8";
}

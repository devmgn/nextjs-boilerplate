import { loadEnvConfig } from "@next/env";

export default function config() {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
  process.env.LANG = "ja_JP.UTF-8";
}

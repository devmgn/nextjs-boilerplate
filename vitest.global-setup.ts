import { loadEnvConfig } from "@next/env";

export default function config() {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
}

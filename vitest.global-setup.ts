import { loadEnvConfig } from "@next/env";

/** Global setup for Vitest. Loads `.env` and pins the time zone. */
export default function config() {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
}

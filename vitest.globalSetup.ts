import { loadEnvConfig } from "@next/env";

const config = () => {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
  process.env.LANG = "ja_JP.UTF-8";
};

export default config;

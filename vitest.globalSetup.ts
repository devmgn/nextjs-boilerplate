import { loadEnvConfig } from "@next/env";

const config = () => {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
  process.env.LANG = "ja_JP.UTF-8";
};

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config;

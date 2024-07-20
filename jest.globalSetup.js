// biome-ignore lint/style/useFilenamingConvention: <explanation>
const { loadEnvConfig } = require("@next/env");

module.exports = () => {
  loadEnvConfig(process.cwd());
  process.env.TZ = "Asia/Tokyo";
  process.env.LANG = "ja_JP.UTF-8";
};

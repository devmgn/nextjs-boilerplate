const { loadEnvConfig } = '@next/env';

module.exports = async () => {
  loadEnvConfig(process.cwd());
  process.env.TZ = 'Asia/Tokyo';
  process.env.LANG = 'ja_JP.UTF-8';
};

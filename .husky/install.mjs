// Skip Husky install in production and CI
if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  process.exit(0);
}

// @ts-ignore
const husky = (await import('husky')).default;
console.log(husky());

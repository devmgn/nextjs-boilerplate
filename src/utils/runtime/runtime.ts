export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

// oxlint-disable-next-line unicorn/prefer-global-this
export const isServer = typeof window === "undefined";

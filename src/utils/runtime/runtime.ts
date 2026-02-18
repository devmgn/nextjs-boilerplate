export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
// oxlint-disable-next-line typescript/no-unnecessary-condition
export const isServer = globalThis.window === undefined;

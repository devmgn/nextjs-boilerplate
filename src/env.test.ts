import { describe, expect, it, vi } from "vitest";
import { ENV } from "./env";

describe("ENV", () => {
  it("creates ENV from valid environment variables", () => {
    expect(ENV).toStrictEqual({
      SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      DEFAULT_DESCRIPTION: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
    });
  });

  it("makes ENV readonly", () => {
    expect(Object.isFrozen(ENV)).toBeTruthy();
  });

  it.each([
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_DEFAULT_DESCRIPTION",
  ])("throws when %s is undefined", async (key) => {
    // Passing undefined as the second argument removes the env variable
    vi.stubEnv(key, undefined);
    vi.resetModules();

    await expect(async () => await import("./env")).rejects.toThrow(/invalid/u);
  });
});

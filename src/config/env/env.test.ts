import { ENV } from "./env";

describe("ENV", () => {
  it("有効な環境変数でENVが生成されること", () => {
    expect(ENV).toStrictEqual({
      SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      DEFAULT_DESCRIPTION: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
    });
  });

  it("ENVがreadonlyであること", () => {
    expect(Object.isFrozen(ENV)).toBe(true);
  });

  it.each([
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_DEFAULT_DESCRIPTION",
  ])("%s が未定義の場合エラーになること", async (key) => {
    vi.stubEnv(key, undefined as unknown as string);
    vi.resetModules();

    await expect(() => import("./env")).rejects.toThrow(/invalid/);
  });
});

import { ENV } from "./env";
import { envSchema } from "../../schemas/env.schema";

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

  describe("envSchema", () => {
    it("SITE_URLが無効なURLの場合エラーになること", () => {
      expect(() => envSchema.parse({ ...ENV, SITE_URL: "not-a-url" })).toThrow(
        /invalid_format/,
      );
    });

    it("APP_NAMEが未定義の場合エラーになること", () => {
      const { APP_NAME: _, ...withoutAppName } = ENV;

      expect(() => envSchema.parse(withoutAppName)).toThrow(/invalid_type/);
    });

    it("DEFAULT_DESCRIPTIONが未定義の場合エラーになること", () => {
      const { DEFAULT_DESCRIPTION: _, ...withoutDesc } = ENV;

      expect(() => envSchema.parse(withoutDesc)).toThrow(/invalid_type/);
    });
  });
});

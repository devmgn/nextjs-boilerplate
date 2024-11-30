import { getEnv } from ".";

type EnvKey = Parameters<typeof getEnv>[0];

describe("getEnv", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: {
        // biome-ignore lint/style/useNamingConvention: <explanation>
        TEST_STRING: "test",
        // biome-ignore lint/style/useNamingConvention: <explanation>
        TEST_NUMBER: "123",
        // biome-ignore lint/style/useNamingConvention: <explanation>
        TEST_BOOLEAN_TRUE: "true",
        // biome-ignore lint/style/useNamingConvention: <explanation>
        TEST_BOOLEAN_FALSE: "false",
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("文字列の取得", () => {
    it("オプションなしで呼び出されたとき、文字列値を返すこと", () => {
      expect(getEnv("TEST_STRING" as EnvKey)).toBe("test");
    });

    it("環境変数が定義されていないとき、エラーをスローすること", () => {
      expect(() => getEnv("NON_EXISTENT_VAR" as EnvKey)).toThrow();
    });
  });

  describe("数値の取得", () => {
    it("asNumber: trueで呼び出されたとき、数値を返すこと", () => {
      expect(getEnv("TEST_NUMBER" as EnvKey, { asNumber: true })).toBe(123);
    });

    it("asNumber: trueで呼び出され、値が有効な数値でないとき、エラーをスローすること", () => {
      expect(() =>
        getEnv("TEST_STRING" as EnvKey, { asNumber: true }),
      ).toThrow();
    });
  });

  describe("真偽値の取得", () => {
    it('asBoolean: trueで呼び出され、値が"true"のとき、trueを返すこと', () => {
      expect(getEnv("TEST_BOOLEAN_TRUE" as EnvKey, { asBoolean: true })).toBe(
        true,
      );
    });

    it('asBoolean: trueで呼び出され、値が"false"のとき、falseを返すこと', () => {
      expect(getEnv("TEST_BOOLEAN_FALSE" as EnvKey, { asBoolean: true })).toBe(
        false,
      );
    });

    it("asBoolean: trueで呼び出され、値が有効な真偽値でないとき、エラーをスローすること", () => {
      expect(() =>
        getEnv("TEST_STRING" as EnvKey, { asBoolean: true }),
      ).toThrow();
    });
  });
});

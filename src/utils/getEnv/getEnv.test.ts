import type { EnvKey } from "@/config";
import { getEnv } from ".";

describe("getEnv", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: {
        testString: "test",
        testNumber: "123",
        testBooleanTrue: "true",
        testBooleanFalse: "false",
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("文字列の取得", () => {
    it("オプションなしで呼び出されたとき、文字列値を返すこと", () => {
      expect(getEnv("testString" as EnvKey)).toBe("test");
    });

    it("環境変数が定義されていないとき、エラーをスローすること", () => {
      expect(() => getEnv("nonExistenceEnv" as EnvKey)).toThrow();
    });
  });

  describe("数値の取得", () => {
    it("asNumber: trueで呼び出されたとき、数値を返すこと", () => {
      expect(getEnv("testNumber" as EnvKey, { asNumber: true })).toBe(123);
    });

    it("asNumber: trueで呼び出され、値が有効な数値でないとき、エラーをスローすること", () => {
      expect(() =>
        getEnv("testString" as EnvKey, { asNumber: true }),
      ).toThrow();
    });
  });

  describe("真偽値の取得", () => {
    it('asBoolean: trueで呼び出され、値が"true"のとき、trueを返すこと', () => {
      expect(getEnv("testBooleanTrue" as EnvKey, { asBoolean: true })).toBe(
        true,
      );
    });

    it('asBoolean: trueで呼び出され、値が"false"のとき、falseを返すこと', () => {
      expect(getEnv("testBooleanFalse" as EnvKey, { asBoolean: true })).toBe(
        false,
      );
    });

    it("asBoolean: trueで呼び出され、値が有効な真偽値でないとき、エラーをスローすること", () => {
      expect(() =>
        getEnv("testString" as EnvKey, { asBoolean: true }),
      ).toThrow();
    });
  });
});

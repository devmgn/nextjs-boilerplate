import { parseEnv } from ".";

describe("parseEnv", () => {
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
      expect(parseEnv(process.env.testString)).toBe("test");
    });

    it("環境変数が定義されていないとき、エラーをスローすること", () => {
      expect(() => parseEnv(process.env.undefinedEnv)).toThrow();
    });
  });

  describe("数値の取得", () => {
    it("asNumber: trueで呼び出されたとき、数値を返すこと", () => {
      expect(parseEnv(process.env.testNumber, { asNumber: true })).toBe(123);
    });

    it("asNumber: trueで呼び出され、値が有効な数値でないとき、エラーをスローすること", () => {
      expect(() =>
        parseEnv(process.env.testString, { asNumber: true }),
      ).toThrow();
    });

    it("環境変数が定義されていないとき、エラーをスローすること", () => {
      expect(() =>
        parseEnv(process.env.undefinedEnv, { asNumber: true }),
      ).toThrow();
    });
  });

  describe("真偽値の取得", () => {
    it('asBoolean: trueで呼び出され、値が"true"のとき、trueを返すこと', () => {
      expect(parseEnv(process.env.testBooleanTrue, { asBoolean: true })).toBe(
        true,
      );
    });

    it('asBoolean: trueで呼び出され、値が"false"のとき、falseを返すこと', () => {
      expect(parseEnv(process.env.testBooleanFalse, { asBoolean: true })).toBe(
        false,
      );
    });

    it("asBoolean: trueで呼び出され、値が有効な真偽値でないとき、エラーをスローすること", () => {
      expect(() =>
        parseEnv(process.env.testString, { asBoolean: true }),
      ).toThrow();
    });

    it("環境変数が定義されていないとき、エラーをスローすること", () => {
      expect(() =>
        parseEnv(process.env.undefinedEnv, { asBoolean: true }),
      ).toThrow();
    });
  });

  describe("nullの取得", () => {
    it('値が"null"のとき、nullを返すこと', () => {
      expect(parseEnv(process.env.testString, { asNull: true })).toBe(null);
    });

    it("環境変数が定義されていないとき、エラーをスローすること", () => {
      expect(() =>
        parseEnv(process.env.undefinedEnv, { asNull: true }),
      ).toThrow();
    });
  });
});

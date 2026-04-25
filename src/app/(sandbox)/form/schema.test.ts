import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "./schema";

describe("postSchema", () => {
  it("全フィールドが妥当な値のとき、parse が成功すること", () => {
    const result = postSchema.safeParse({
      userId: 1,
      id: 1,
      title: "Title",
      body: "Body",
    });
    expect(result.success).toBe(true);
  });

  it("title が空文字のとき、parse が失敗すること", () => {
    const result = postSchema.safeParse({
      userId: 1,
      id: 1,
      title: "",
      body: "Body",
    });
    expect(result.success).toBe(false);
  });

  it("body が空文字のとき、parse が失敗すること", () => {
    const result = postSchema.safeParse({
      userId: 1,
      id: 1,
      title: "Title",
      body: "",
    });
    expect(result.success).toBe(false);
  });

  it("userId が文字列のとき、parse が失敗すること", () => {
    const result = postSchema.safeParse({
      userId: "1",
      id: 1,
      title: "Title",
      body: "Body",
    });
    expect(result.success).toBe(false);
  });
});

describe("postSchema + zodResolver", () => {
  // RHF v8 + @hookform/resolvers v5 + Zod v4 の結合確認。
  // peerDependencyRules.allowAny で peer 警告を抑制している組み合わせのため、
  // resolver が期待どおりの shape を返すことを実体で担保しておく。
  const resolver = zodResolver(postSchema);
  const ctx = { fields: {}, shouldUseNativeValidation: false } as const;

  it("妥当な値のとき、values を返し errors は空となること", async () => {
    const data = { userId: 1, id: 1, title: "t", body: "b" };
    const result = await resolver(data, undefined, ctx);
    expect(result.values).toStrictEqual(data);
    expect(result.errors).toStrictEqual({});
  });

  it("title と body が空のとき、両フィールドにエラーが設定されること", async () => {
    const result = await resolver(
      { userId: 1, id: 1, title: "", body: "" },
      undefined,
      ctx,
    );
    expect(result.values).toStrictEqual({});
    expect(result.errors).toHaveProperty("title");
    expect(result.errors).toHaveProperty("body");
  });
});

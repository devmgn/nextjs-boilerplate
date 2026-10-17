import { zodResolver } from "@hookform/resolvers/zod";
import { describe, expect, it } from "vitest";
import { articleSchema } from "./article-schema";

const valid = {
  title: "Title",
  description: "Description",
  body: "Body",
  tags: "react, nextjs",
};

describe("articleSchema", () => {
  it("全フィールドが妥当な値のとき、parse が成功すること", () => {
    expect(articleSchema.safeParse(valid).success).toBeTruthy();
  });

  it("tags が空文字でも parse が成功すること", () => {
    expect(
      articleSchema.safeParse({ ...valid, tags: "" }).success
    ).toBeTruthy();
  });

  it.each(["title", "description", "body"] as const)(
    "%s が空文字のとき、parse が失敗すること",
    (field) => {
      expect(
        articleSchema.safeParse({ ...valid, [field]: "" }).success
      ).toBeFalsy();
    }
  );
});

describe("articleSchema + zodResolver", () => {
  // RHF v8 + @hookform/resolvers v5 + Zod v4 の結合確認。
  // peerDependencyRules.allowAny で peer 警告を抑制している組み合わせのため、
  // resolver が期待どおりの shape を返すことを実体で担保しておく。
  const resolver = zodResolver(articleSchema);
  const ctx = { fields: {}, shouldUseNativeValidation: false } as const;

  it("妥当な値のとき、values を返し errors は空となること", async () => {
    const result = await resolver(valid, undefined, ctx);
    expect(result.values).toStrictEqual(valid);
    expect(result.errors).toStrictEqual({});
  });

  it("title と body が空のとき、両フィールドにエラーが設定されること", async () => {
    const result = await resolver(
      { ...valid, title: "", body: "" },
      undefined,
      ctx
    );
    expect(result.values).toStrictEqual({});
    expect(result.errors).toHaveProperty("title");
    expect(result.errors).toHaveProperty("body");
  });
});

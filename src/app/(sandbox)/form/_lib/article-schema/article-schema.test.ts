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
  it("parses when all fields are valid", () => {
    expect(articleSchema.safeParse(valid).success).toBeTruthy();
  });

  it("parses when tags is an empty string", () => {
    expect(
      articleSchema.safeParse({ ...valid, tags: "" }).success
    ).toBeTruthy();
  });

  it.each(["title", "description", "body"] as const)(
    "fails to parse when %s is an empty string",
    (field) => {
      expect(
        articleSchema.safeParse({ ...valid, [field]: "" }).success
      ).toBeFalsy();
    }
  );
});

describe("articleSchema + zodResolver", () => {
  // Integration check for RHF v8 + @hookform/resolvers v5 + Zod v4.
  // Peer warnings for this combination are suppressed via peerDependencyRules.allowAny,
  // so verify against the real resolver that it returns the expected shape.
  const resolver = zodResolver(articleSchema);
  const ctx = { fields: {}, shouldUseNativeValidation: false } as const;

  it("returns values and empty errors for valid input", async () => {
    const result = await resolver(valid, undefined, ctx);
    expect(result.values).toStrictEqual(valid);
    expect(result.errors).toStrictEqual({});
  });

  it("sets errors on both fields when title and body are empty", async () => {
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

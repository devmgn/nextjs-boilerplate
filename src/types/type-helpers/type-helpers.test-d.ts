import type { Expand, FlatObject, Primitive } from "./type-helpers";
import { describe, expectTypeOf, it } from "vitest";

describe("typeHelpers", () => {
  describe("Expand", () => {
    it("Expand: returns primitive types as-is", () => {
      expectTypeOf<Expand<string>>().toEqualTypeOf<string>();
      expectTypeOf<Expand<number>>().toEqualTypeOf<number>();
      expectTypeOf<Expand<boolean>>().toEqualTypeOf<boolean>();
      expectTypeOf<Expand<null>>().toEqualTypeOf<null>();
      expectTypeOf<Expand<undefined>>().toEqualTypeOf<undefined>();
    });

    it("Expand: expands a flat intersection type", () => {
      type Input = { a: string } & { b: number };

      interface Expected {
        a: string;
        b: number;
      }

      expectTypeOf<Expand<Input>>().toEqualTypeOf<Expected>();
    });

    it("Expand: recursively expands nested intersection types", () => {
      interface Input {
        nested: { a: string } & { b: number };
      }

      interface Expected {
        nested: { a: string; b: number };
      }

      expectTypeOf<Expand<Input>>().toEqualTypeOf<Expected>();
    });
  });

  describe("Primitive", () => {
    it("Primitive: accepts all primitive values", () => {
      expectTypeOf<null>().toExtend<Primitive>();
      expectTypeOf<undefined>().toExtend<Primitive>();
      expectTypeOf<string>().toExtend<Primitive>();
      expectTypeOf<number>().toExtend<Primitive>();
      expectTypeOf<boolean>().toExtend<Primitive>();
      expectTypeOf<symbol>().toExtend<Primitive>();
      expectTypeOf<bigint>().toExtend<Primitive>();
    });

    it("Primitive: excludes object types", () => {
      expectTypeOf<{ a: string }>().not.toExtend<Primitive>();
      expectTypeOf<string[]>().not.toExtend<Primitive>();
    });
  });

  describe("FlatObject", () => {
    // FlatObject
    it("FlatObject: accepts objects with only primitive values", () => {
      expectTypeOf<{
        a: string;
        b: number;
        c: null;
      }>().toExtend<FlatObject>();
    });

    it("FlatObject: rejects nested objects", () => {
      expectTypeOf<{ a: { nested: string } }>().not.toExtend<FlatObject>();
    });
  });
});

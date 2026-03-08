import "@testing-library/jest-dom";
/**
 * jest-extended の追加マッチャーを Vitest に登録する
 * @see https://github.com/jest-community/jest-extended
 */
// oxlint-disable-next-line import/no-namespace
import * as matchers from "jest-extended";
import { expect } from "vitest";

expect.extend(matchers);

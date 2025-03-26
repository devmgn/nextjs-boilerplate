import "@testing-library/jest-dom";
/**
 * Jestの追加のマッチャーを使うための設定
 * @see https://github.com/jest-community/jest-extended
 */
import * as matchers from "jest-extended";
import { expect } from "vitest";

expect.extend(matchers);

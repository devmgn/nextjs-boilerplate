import { execFileSync } from "node:child_process";
import { REACT_DOCTOR_RULE_REGISTRY } from "oxlint-plugin-react-doctor/core";

// oxlint-plugin-react-doctor は 900 超のルールを持つが、その多くはこのリポジトリに
// 無関係（three.js / Ink / React Native など）か、oxlint のネイティブルールと重複する。
// ここで機械的に絞り込み、結果を oxlint.config.ts へ生成する。
//
// 生成: `pnpm generate-oxlint-rules`
// 検証: oxlint.config.test.ts が config と本モジュールの算出結果の一致を確認する。

/** このリポジトリのスタック。react-doctor の `requires` / `disabledWhen` と突き合わせる。 */
const CAPABILITIES = new Set([
  "nextjs",
  "nextjs:15",
  "radix-ui",
  "react",
  "react:18",
  "react:19",
  "react:19.2",
  "react-compiler",
  "ssr",
  "tailwind",
  "tailwind:3.4",
  "tailwind:4",
  "tanstack-query",
  "zod:4",
]);

// ライブラリ固有ルールの一部は `requires` を宣言せず `react` しか要求しない
// （例: jotai-* / motion-*）。使っていないライブラリのルールは発火しないだけとはいえ
// 設定のノイズになるため、トークンで除外する。
// 対応ライブラリを導入したら、ここからトークンを削除して再生成する。
const UNUSED_LIBRARY_TOKENS = new Set([
  "apollo",
  "chakra",
  "emotion",
  "formik",
  "gsap",
  "ink",
  "jotai",
  "lexical",
  "lottie",
  "mobx",
  "motion",
  "recoil",
  "redux",
  "slate",
  "styled",
  "swr",
  "trpc",
  "valtio",
  "xstate",
  "zustand",
]);

// oxlint のネイティブ react / jsx-a11y プラグインへ移植済みのルールは
// `oxlint --print-config` から機械的に得る（両方有効にすると同じ行が二重報告される）。
//
// 一方、ルール名が一致しない意味的な重複は許容する。@tanstack/eslint-plugin-query
// （query-no-void-query-fn など）や React Compiler ネイティブルール
// （react/no-deriving-state-in-effects ↔ react-doctor/no-derived-state）が該当する。
// 機械的に検出できず、手書きの対応表を持つ方が陳腐化のコストが高いため。

interface PrintedConfig {
  rules: Record<string, unknown>;
}

function isPrintedConfig(value: unknown): value is PrintedConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "rules" in value &&
    typeof value.rules === "object"
  );
}

/** `oxlint --print-config` が返すネイティブルール名（プラグイン接頭辞を除いたもの）。 */
function loadNativeRuleNames(): Set<string> {
  const stdout = execFileSync(
    "./node_modules/.bin/oxlint",
    ["--print-config"],
    {
      encoding: "utf8",
    },
  );
  const printed: unknown = JSON.parse(stdout);
  if (!isPrintedConfig(printed)) {
    throw new Error("oxlint --print-config の出力に rules がありません。");
  }
  const names = new Set<string>();
  for (const name of Object.keys(printed.rules)) {
    const slash = name.lastIndexOf("/");
    names.add(slash === -1 ? name : name.slice(slash + 1));
  }
  return names;
}

function hasUnusedLibraryToken(ruleId: string): boolean {
  return ruleId.split("-").some((token) => UNUSED_LIBRARY_TOKENS.has(token));
}

/**
 * Oxlint で有効化する react-doctor ルールを算出する。
 *
 * 除外するもの:
 *
 * 1. プロジェクト全体解析が必要で oxlint 単体では動かないもの（React Doctor CLI 専用）
 * 2. React-doctor 自身が既定 off にしている opt-in ルール
 * 3. このリポジトリのスタックに合致しないもの（capability / 未使用ライブラリ）
 * 4. ネイティブ oxlint ルールと重複するもの
 *
 * Severity はリポジトリ方針に合わせて一律 `error`。
 */
export function selectReactDoctorRules(): Record<string, "error"> {
  const nativeRuleNames = loadNativeRuleNames();

  function isEnabled([ruleId, rule]: [
    string,
    (typeof REACT_DOCTOR_RULE_REGISTRY)[string],
  ]): boolean {
    return (
      !rule.isScanRule &&
      rule.isProjectRule !== true &&
      rule.defaultEnabled !== false &&
      (rule.requires ?? []).every((cap) => CAPABILITIES.has(cap)) &&
      !(rule.disabledWhen ?? []).some((cap) => CAPABILITIES.has(cap)) &&
      !hasUnusedLibraryToken(ruleId) &&
      !nativeRuleNames.has(ruleId)
    );
  }

  return Object.fromEntries(
    Object.entries(REACT_DOCTOR_RULE_REGISTRY)
      .filter((entry) => isEnabled(entry))
      .map(([ruleId]) => [`react-doctor/${ruleId}`, "error"]),
  );
}

import { describe, expect, it } from "vitest";
import oxlintConfig from "../../oxlint.config.ts";

// 外部 jsPlugin（tanstack / storybook / react-hooks）は config にルールを手動列挙しているため、
// プラグイン更新で増えた新ルールを取りこぼしうる（前方ドリフト）。それを検出して採用/除外の判断を促す。
// 実在しないルール名は oxlint が config パース時に弾くため、後方ドリフトは扱わない。

interface PluginLike {
  rules?: Record<string, unknown>;
}
type JsPluginEntry = string | { name?: string; specifier: string };

// config に載せない外部ルールと、その理由。
const IGNORED_RULES = new Set<string>([
  // oxlint native の react ルールと重複
  "react-compiler-rules/rules-of-hooks",
  "react-compiler-rules/hooks",
  "react-compiler-rules/exhaustive-deps",
  // 依存検証（opt-in）。React Compiler 有効環境では不要
  "react-compiler-rules/memo-dependencies",
  "react-compiler-rules/exhaustive-effect-dependencies",
  // コンパイラ内部診断でコード規則ではない
  "react-compiler-rules/invariant",
  "react-compiler-rules/todo",
  // fbt（Meta の i18n）未使用
  "react-compiler-rules/fbt",
  // 削除済み（deprecated）
  "react-compiler-rules/component-hook-factories",
  // gating モード未使用
  "react-compiler-rules/gating",
  // 正当な suppression まで禁じるため不採用
  "react-compiler-rules/rule-suppression",
  // 構文診断系でノイズになりうる
  "react-compiler-rules/syntax",
]);

// プラグイン specifier → oxlint の前缀（eslint-plugin-x → x ／ @scope/eslint-plugin-x → @scope/x）。
function stripEslintPluginPrefix(name: string): string {
  const marker = "eslint-plugin-";
  return name.startsWith(marker) ? name.slice(marker.length) : name;
}

function normalizePluginPrefix(specifier: string): string {
  if (!specifier.startsWith("@")) {
    return stripEslintPluginPrefix(specifier);
  }
  const slash = specifier.indexOf("/");
  const scope = specifier.slice(0, slash);
  const rest = specifier.slice(slash + 1);
  return rest === "eslint-plugin"
    ? scope
    : `${scope}/${stripEslintPluginPrefix(rest)}`;
}

// config の jsPlugins（top-level + overrides）を集める。
function collectJsPluginEntries(): JsPluginEntry[] {
  const entries: JsPluginEntry[] = [
    ...(oxlintConfig.jsPlugins as JsPluginEntry[]),
  ];
  for (const override of oxlintConfig.overrides) {
    const overridePlugins = override.jsPlugins as JsPluginEntry[] | undefined;
    if (overridePlugins !== undefined) {
      entries.push(...overridePlugins);
    }
  }
  return entries;
}

// entry → { 前缀, specifier }。相対パス（自作プラグイン）は除外。
function resolveExternalPlugin(
  entry: JsPluginEntry,
): { prefix: string; specifier: string } | undefined {
  const specifier = typeof entry === "string" ? entry : entry.specifier;
  if (specifier.startsWith(".")) {
    return undefined;
  }
  const explicitName = typeof entry === "string" ? undefined : entry.name;
  return {
    prefix: `${explicitName ?? normalizePluginPrefix(specifier)}/`,
    specifier,
  };
}

// config だけから求まる外部 jsPlugin の前缀集合（読み込み結果の照合用）。
function declaredExternalPrefixes(): Set<string> {
  const prefixes = new Set<string>();
  for (const entry of collectJsPluginEntries()) {
    const resolved = resolveExternalPlugin(entry);
    if (resolved !== undefined) {
      prefixes.add(resolved.prefix);
    }
  }
  return prefixes;
}

// 前缀 → プラグインが公開する全ルール名。
async function buildExternalPlugins(): Promise<Record<string, string[]>> {
  // 前缀で重複排除（overrides の storybook 等）してから並列に import する。
  const byPrefix = new Map<string, string>();
  for (const entry of collectJsPluginEntries()) {
    const resolved = resolveExternalPlugin(entry);
    if (resolved !== undefined && !byPrefix.has(resolved.prefix)) {
      byPrefix.set(resolved.prefix, resolved.specifier);
    }
  }
  const loaded = await Promise.all(
    [...byPrefix].map(async ([prefix, specifier]) => {
      const mod = (await import(specifier)) as {
        default?: PluginLike;
      } & PluginLike;
      const plugin = mod.default ?? mod;
      return [prefix, Object.keys(plugin.rules ?? {})] as const;
    }),
  );
  return Object.fromEntries(loaded);
}

// top-level と overrides 両方の rules キーを集める（storybook は overrides にのみ現れる）。
function collectConfiguredRuleNames(): Set<string> {
  const names = new Set<string>();
  function addAll(rules: Record<string, unknown> | undefined): void {
    for (const name of Object.keys(rules ?? {})) {
      names.add(name);
    }
  }
  addAll(oxlintConfig.rules as Record<string, unknown> | undefined);
  for (const override of oxlintConfig.overrides) {
    addAll(override.rules as Record<string, unknown> | undefined);
  }
  return names;
}

function untriagedRules(
  prefix: string,
  ruleNames: readonly string[],
  configured: ReadonlySet<string>,
): string[] {
  return ruleNames
    .map((name) => `${prefix}${name}`)
    .filter((key) => !configured.has(key) && !IGNORED_RULES.has(key));
}

const externalPlugins = await buildExternalPlugins();

describe("oxlint config ↔ プラグイン整合性 (前方ドリフト検出)", () => {
  const configured = collectConfiguredRuleNames();

  it("config 宣言の外部 jsPlugin を全て読み込めている", () => {
    const declared = declaredExternalPrefixes();
    // 0 件だと it.each が空になり素通りするためのガード。
    expect(declared.size).toBeGreaterThan(0);
    expect(new Set(Object.keys(externalPlugins))).toStrictEqual(declared);
  });

  it.each(Object.entries(externalPlugins))(
    "%s の全公開ルールが設定済 or 許可リストにある",
    (prefix, ruleNames) => {
      // import 形状の退行で空配列＝素通りになるのを防ぐ。
      expect(
        ruleNames.length,
        `${prefix} のルールが読めていない（プラグインの import 形状が変わった可能性）`,
      ).toBeGreaterThan(0);

      const untriaged = untriagedRules(prefix, ruleNames, configured);
      expect(
        untriaged,
        `未 triage の新ルール（config 追加 or 許可リスト登録が必要）: ${untriaged.join(", ")}`,
      ).toStrictEqual([]);
    },
  );
});

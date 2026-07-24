import { describe, expect, it } from "vitest";
import oxlintConfig from "../../oxlint.config.ts";

// 外部 jsPlugin（tanstack / storybook）は config にルールを手動列挙しているため、
// プラグイン更新で増えた新ルールを取りこぼしうる（前方ドリフト）。それを検出して採用/除外の判断を促す。
// 実在しないルール名は oxlint が config パース時に弾くため、後方ドリフトは扱わない。

interface PluginLike {
  rules?: Record<string, unknown>;
}
type JsPluginEntry = string | { name?: string; specifier: string };

// config に載せない外部ルールと、その理由。
// 現状は tanstack / storybook の全公開ルールを config に列挙済みのため空。
// triage の結果「採用しない」と判断した外部ルールはここに理由付きで追加する。
const IGNORED_RULES = new Set<string>();

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

// 前缀 → specifier（overrides の storybook 等は前缀で重複排除）。import せず sync に列挙する。
// これを it.each のデータ源にすることで、top-level await なしに動的 import をテスト内へ遅延できる。
function collectExternalPluginSpecifiers(): Map<string, string> {
  const byPrefix = new Map<string, string>();
  for (const entry of collectJsPluginEntries()) {
    const resolved = resolveExternalPlugin(entry);
    if (resolved !== undefined && !byPrefix.has(resolved.prefix)) {
      byPrefix.set(resolved.prefix, resolved.specifier);
    }
  }
  return byPrefix;
}

// specifier のプラグインが公開する全ルール名。
async function loadPluginRules(specifier: string): Promise<string[]> {
  const mod = (await import(specifier)) as {
    default?: PluginLike;
  } & PluginLike;
  const plugin = mod.default ?? mod;
  return Object.keys(plugin.rules ?? {});
}

// top-level と overrides 両方の rules キーを集める（storybook は overrides にのみ現れる）。
function collectConfiguredRuleNames(): Set<string> {
  const names = new Set<string>();
  function addAll(rules: Record<string, unknown> | undefined): void {
    for (const name of Object.keys(rules ?? {})) {
      names.add(name);
    }
  }
  addAll(oxlintConfig.rules);
  for (const override of oxlintConfig.overrides) {
    addAll(override.rules);
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

const externalPluginSpecifiers = collectExternalPluginSpecifiers();

describe("oxlint config ↔ プラグイン整合性 (前方ドリフト検出)", () => {
  const configured = collectConfiguredRuleNames();

  it("config 宣言の外部 jsPlugin が 1 つ以上ある", () => {
    // 0 件だと it.each が空になり素通りするためのガード。
    expect(externalPluginSpecifiers.size).toBeGreaterThan(0);
  });

  it.each([...externalPluginSpecifiers])(
    "%s の全公開ルールが設定済 or 許可リストにある",
    async (prefix, specifier) => {
      const ruleNames = await loadPluginRules(specifier);
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

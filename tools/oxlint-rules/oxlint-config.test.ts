import { describe, expect, it } from "vitest";
import oxlintConfig from "../../oxlint.config.ts";

// 自前でルールを手動列挙している外部 jsPlugin（tanstack / storybook）は、
// プラグイン更新で増えた新ルールを取りこぼしうる（前方ドリフト）。それを検出して採用/除外の判断を促す。
// 実在しないルール名は oxlint が config パース時に弾くため、後方ドリフトは扱わない。

/** プラグインが公開する 1 ルール。ここではキー名しか使わないため create の有無だけ表明する。 */
interface PluginRule {
  readonly create?: unknown;
}

/** プラグインが公開するルール表。 */
type RuleTable = Readonly<Record<string, PluginRule>>;

interface PluginLike {
  rules?: RuleTable;
}
type JsPluginEntry = string | { name?: string; specifier: string };

// ルール選定を ultracite の preset が持つプラグイン。採否は ultracite 側の責務。
const ULTRACITE_MANAGED_PREFIXES = new Set([
  "github/",
  "react-doctor/",
  "sonarjs/",
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
  // SAFETY: oxlint の型では jsPlugins が緩いユニオンだが、
  // 本 config が入れるのは string か { name, specifier } のみ。
  const entries: JsPluginEntry[] = [
    ...(oxlintConfig.jsPlugins as JsPluginEntry[]),
  ];
  for (const override of oxlintConfig.overrides) {
    // SAFETY: 上と同じ。override の jsPlugins も同じ形しか入れていない。
    const overridePlugins = override.jsPlugins as JsPluginEntry[] | undefined;
    if (overridePlugins !== undefined) {
      entries.push(...overridePlugins);
    }
  }
  return entries;
}

/** JsPlugins の要素が specifier 文字列の短縮形かを判定する。 */
function isStringEntry(entry: JsPluginEntry): entry is string {
  return typeof entry === "string";
}

// entry → { 前缀, specifier }。相対パス（自作プラグイン）は除外。
function resolveExternalPlugin(
  entry: JsPluginEntry
): { prefix: string; specifier: string } | undefined {
  const specifier = isStringEntry(entry) ? entry : entry.specifier;
  if (specifier.startsWith(".")) {
    return undefined;
  }
  const explicitName = isStringEntry(entry) ? undefined : entry.name;
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
    if (
      resolved !== undefined &&
      !byPrefix.has(resolved.prefix) &&
      !ULTRACITE_MANAGED_PREFIXES.has(resolved.prefix)
    ) {
      byPrefix.set(resolved.prefix, resolved.specifier);
    }
  }
  return byPrefix;
}

function isPluginLike(value: unknown): value is PluginLike {
  return typeof value === "object" && value !== null;
}

function hasDefaultExport(value: unknown): value is { default: PluginLike } {
  return (
    isPluginLike(value) && "default" in value && isPluginLike(value.default)
  );
}

// specifier のプラグインが公開する全ルール名。
// default export か名前空間のどちらかに rules を持つ規約に従う。
async function loadPluginRules(specifier: string): Promise<string[]> {
  const mod: unknown = await import(specifier);
  const plugin = hasDefaultExport(mod) ? mod.default : mod;
  return isPluginLike(plugin) ? Object.keys(plugin.rules ?? {}) : [];
}

// top-level と overrides 両方の rules キーを集める（storybook は overrides にのみ現れる）。
function collectConfiguredRuleNames(): Set<string> {
  const names = new Set<string>();
  function addAll(ruleNames: readonly string[]): void {
    for (const name of ruleNames) {
      names.add(name);
    }
  }
  addAll(Object.keys(oxlintConfig.rules ?? {}));
  for (const override of oxlintConfig.overrides) {
    addAll(Object.keys(override.rules ?? {}));
  }
  return names;
}

function untriagedRules(
  prefix: string,
  ruleNames: readonly string[],
  configured: ReadonlySet<string>
): string[] {
  return ruleNames
    .map((name) => `${prefix}${name}`)
    .filter((key) => !configured.has(key));
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
        `${prefix} のルールが読めていない（プラグインの import 形状が変わった可能性）`
      ).toBeGreaterThan(0);

      const untriaged = untriagedRules(prefix, ruleNames, configured);
      expect(
        untriaged,
        `未 triage の新ルール（config 追加 or 許可リスト登録が必要）: ${untriaged.join(", ")}`
      ).toStrictEqual([]);
    }
  );
});

import { describe, expect, it } from "vitest";
import oxlintConfig from "../../oxlint.config.ts";

// External jsPlugins whose rules we enumerate by hand (tanstack / storybook) can miss new
// rules added by plugin updates (forward drift). Detect that and prompt an adopt/exclude decision.
// oxlint rejects nonexistent rule names when parsing the config, so backward drift is not covered.

/**
 * A single rule exposed by a plugin. Only the key name is used here, so just
 * declare the optional create.
 */
interface PluginRule {
  readonly create?: unknown;
}

/** Rule table exposed by a plugin. */
type RuleTable = Readonly<Record<string, PluginRule>>;

interface PluginLike {
  rules?: RuleTable;
}

type JsPluginEntry = string | { name?: string; specifier: string };

// Plugins whose rule selection is owned by the ultracite preset. Adoption is ultracite's responsibility.
const ULTRACITE_MANAGED_PREFIXES = new Set([
  "github/",
  "jsdoc-js/",
  "react-doctor/",
  "sonarjs/",
  "tsdoc/",
]);

// Plugin specifier → oxlint prefix (eslint-plugin-x → x / @scope/eslint-plugin-x → @scope/x).
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

// Collect jsPlugins from the config (top-level + overrides).
function collectJsPluginEntries(): JsPluginEntry[] {
  // SAFETY: oxlint types jsPlugins as a loose union, but
  // this config only uses string or { name, specifier }.
  const entries: JsPluginEntry[] = [
    ...(oxlintConfig.jsPlugins as JsPluginEntry[]),
  ];

  for (const override of oxlintConfig.overrides) {
    // SAFETY: Same as above. Override jsPlugins use only the same shapes.
    const overridePlugins = override.jsPlugins as JsPluginEntry[] | undefined;

    if (overridePlugins !== undefined) {
      entries.push(...overridePlugins);
    }
  }

  return entries;
}

/**
 * Checks whether a jsPlugins entry is the shorthand specifier string.
 *
 * @param entry - The jsPlugins entry to check
 * @returns True if it is the string shorthand
 */
function isStringEntry(entry: JsPluginEntry): entry is string {
  return typeof entry === "string";
}

// entry → `{ prefix, specifier }`. Relative paths (local plugins) are excluded.
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

// prefix → specifier (storybook etc. in overrides are deduplicated by prefix). Enumerated synchronously without importing.
// Using this as the it.each data source defers the dynamic import into the test without top-level await.
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

// All rule names exposed by the plugin at specifier.
// Follows the convention that rules live on either the default export or the namespace.
async function loadPluginRules(specifier: string): Promise<string[]> {
  const mod: unknown = await import(specifier);
  const plugin = hasDefaultExport(mod) ? mod.default : mod;

  return isPluginLike(plugin) ? Object.keys(plugin.rules ?? {}) : [];
}

// Collect rule keys from both top-level and overrides (storybook appears only in overrides).
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
  return ruleNames.flatMap((name) => {
    const key = `${prefix}${name}`;

    return configured.has(key) ? [] : [key];
  });
}

const externalPluginSpecifiers = collectExternalPluginSpecifiers();

describe("oxlint config ↔ plugin consistency (forward drift detection)", () => {
  const configured = collectConfiguredRuleNames();

  it("declares at least one external jsPlugin in the config", () => {
    // Guard: with zero entries, it.each would be empty and silently pass.
    expect(externalPluginSpecifiers.size).toBeGreaterThan(0);
  });

  it.each([...externalPluginSpecifiers])(
    "every public rule of %s is configured or allowlisted",
    async (prefix, specifier) => {
      const ruleNames = await loadPluginRules(specifier);
      // Prevent an import-shape regression from yielding an empty array and silently passing.
      expect(
        ruleNames.length,
        `Failed to read rules for ${prefix} (the plugin's import shape may have changed)`
      ).toBeGreaterThan(0);

      const untriaged = untriagedRules(prefix, ruleNames, configured);
      expect(
        untriaged,
        `Untriaged new rules (add to config or allowlist): ${untriaged.join(", ")}`
      ).toStrictEqual([]);
    }
  );
});

type Combinator = "child" | "descendant";

/**
 * AST node passed from the Oxlint visitor. Declares only what selectors
 * reference (type / parent / arbitrary child properties).
 */
interface AstNode {
  readonly type: string;
  readonly parent?: AstNode | null;
}

/**
 * View for reading an AST node by arbitrary key. Values are limited to
 * AstValue.
 */
interface AstRecord {
  readonly [key: string]: AstValue;
}

/**
 * Values an AST node may hold, within the scope of selector attribute
 * comparison.
 */
type AstValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | AstNode
  | readonly AstValue[];

/** Possible values of a selector literal (the right-hand side of `[a="x"]`). */
type LiteralValue = string | number | boolean | null;

/** Object-form option accepted by `no-restricted-syntax`. */

type AttrMatcher = (node: AstNode) => boolean;

interface Step {
  type: string;
  attrs: AttrMatcher[];
  // Combinator that links this step to the previous one in source-reading order.
  // After reversing into a parent-walk chain (chain[0] = rightmost), chain[i].combinator
  // describes how chain[i] (closer to leaf) relates to chain[i+1] (closer to root).
  combinator?: Combinator | null;
  // True when the compound ends with `:exit`. Only meaningful on chain[0] (the matched node).
  isExit?: boolean;
}

/** One compiled selector branch and the message to report on match. */
export interface Compiled {
  chain: Step[];
  message: string;
}

function isAstNode(value: AstValue): value is AstNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringValue(value: AstValue): value is string {
  return typeof value === "string";
}

/**
 * Checks whether the value is an object readable by arbitrary key. Values are
 * treated as AstValue.
 *
 * @param value - The value to check
 * @returns True if it is an object that is neither an array nor null
 */
function isAstRecord(value: AstValue): value is AstNode & AstRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads an arbitrary property of an AST node.
 *
 * @param node - The AST node to read from
 * @param key - The property name to read
 * @returns The property value, or undefined if unreadable
 */
function readProperty(node: AstNode, key: string): AstValue {
  return isAstRecord(node) ? node[key] : undefined;
}

function getByPath(node: AstNode, path: string[]): AstValue {
  let cur: AstValue = node;

  for (const k of path) {
    if (!isAstNode(cur)) {
      return undefined;
    }

    cur = readProperty(cur, k);
  }

  return cur;
}

const QUOTES = ["'", '"'] as const;

const KEYWORD_LITERALS: ReadonlyMap<string, LiteralValue> = new Map([
  ["true", true],
  ["false", false],
  ["null", null],
]);

function isQuoted(raw: string): boolean {
  return QUOTES.some((q) => raw.startsWith(q) && raw.endsWith(q));
}

function parseNumberOrString(raw: string): number | string {
  return raw.length > 0 && !Number.isNaN(Number(raw)) ? Number(raw) : raw;
}

function parseLiteral(raw: string): LiteralValue {
  if (isQuoted(raw)) {
    return raw.slice(1, -1);
  }

  const keyword = KEYWORD_LITERALS.get(raw);

  if (keyword !== undefined) {
    return keyword;
  }

  return parseNumberOrString(raw);
}

function parseAttr(expr: string): AttrMatcher {
  const eqIdx = expr.indexOf("=");

  if (eqIdx === -1) {
    const path = expr.trim().split(".");

    return (node) => getByPath(node, path) !== undefined;
  }

  const path = expr.slice(0, eqIdx).trim().split(".");
  const raw = expr.slice(eqIdx + 1).trim();

  if (raw.startsWith("/")) {
    const lastSlash = raw.lastIndexOf("/");
    const pattern = raw.slice(1, lastSlash);
    const flags = raw.slice(lastSlash + 1);
    const re = new RegExp(pattern, flags);

    return (node) => {
      const v = getByPath(node, path);

      return isStringValue(v) && re.test(v);
    };
  }

  const val = parseLiteral(raw);

  return (node) => getByPath(node, path) === val;
}

function parseCompound(input: string): Step {
  let s = input;
  let isExit = false;

  if (s.endsWith(":exit")) {
    isExit = true;
    s = s.slice(0, -":exit".length);
  }

  let typeName = "";
  const attrs: AttrMatcher[] = [];
  let i = 0;

  while (i < s.length && s[i] !== "[") {
    typeName += s[i];
    i += 1;
  }

  while (i < s.length) {
    if (s[i] !== "[") {
      throw new Error(`Invalid selector compound: ${input}`);
    }

    const end = s.indexOf("]", i);

    if (end === -1) {
      throw new Error(`Unclosed [ in selector: ${input}`);
    }

    attrs.push(parseAttr(s.slice(i + 1, end)));
    i = end + 1;
  }

  if (typeName.trim().length === 0) {
    throw new Error(`Selector compound missing type name: ${input}`);
  }

  return { type: typeName.trim(), attrs, isExit };
}

const COMBINATOR_CHARS: ReadonlySet<string> = new Set([" ", "\t", ">"]);

const BRACKET_DEPTH_DELTA: ReadonlyMap<string, number> = new Map([
  ["[", 1],
  ["]", -1],
]);

interface CompoundToken {
  text: string;
  // The most recently read combinator. null for the first compound.
  combinator: Combinator | null;
}

interface CombinatorRead {
  combinator: Combinator;
  next: number;
}

function isCombinatorChar(c: string | undefined): boolean {
  return c !== undefined && COMBINATOR_CHARS.has(c);
}

/**
 * Consumes the run of combinator characters from `start` and returns the
 * combinator kind and the next position.
 *
 * @param input - The selector string
 * @param start - The position to start reading from
 * @returns The combinator kind and the position right after it
 */
function readCombinator(input: string, start: number): CombinatorRead {
  let combinator: Combinator = "descendant";
  let i = start;

  while (isCombinatorChar(input[i])) {
    if (input[i] === ">") {
      combinator = "child";
    }

    i += 1;
  }

  return { combinator, next: i };
}

/**
 * Splits on combinators outside brackets into pairs of a compound string and
 * its preceding combinator.
 *
 * @param input - A single-branch selector string without commas
 * @returns Compound/combinator pairs in left-to-right order
 */
function tokenizeBranch(input: string): CompoundToken[] {
  const tokens: CompoundToken[] = [];
  let combinator: Combinator | null = null;
  let buf = "";
  let depth = 0;
  let i = 0;

  const flush = () => {
    const text = buf.trim();
    buf = "";

    if (text.length > 0) {
      tokens.push({ text, combinator });
    }
  };

  while (i < input.length) {
    const c = input[i];

    if (depth === 0 && isCombinatorChar(c)) {
      flush();
      ({ combinator, next: i } = readCombinator(input, i));
    } else {
      depth += BRACKET_DEPTH_DELTA.get(c) ?? 0;
      buf += c;
      i += 1;
    }
  }

  flush();

  return tokens;
}

function parseBranch(input: string): Step[] {
  return tokenizeBranch(input)
    .map(({ text, combinator }) => ({ ...parseCompound(text), combinator }))
    .toReversed();
}

function splitTopLevel(s: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];

    if (c === "[") {
      depth += 1;
    } else if (c === "]") {
      depth -= 1;
    } else if (c === sep && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }

  parts.push(s.slice(start));

  return parts;
}

function parseSelectorGroup(input: string): Step[][] {
  return splitTopLevel(input, ",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((branch) => parseBranch(branch));
}

/**
 * Compiles a selector string per comma-separated branch.
 *
 * @param selector - The `no-restricted-syntax` selector string
 * @param message - The message on match. Uses the default wording if omitted
 * @returns The compiled result for each branch
 */
export function compileOption(selector: string, message?: string): Compiled[] {
  const finalMessage = message ?? `Using "${selector}" is restricted.`;

  return parseSelectorGroup(selector).map((chain) => {
    for (let i = 1; i < chain.length; i += 1) {
      if (chain[i].isExit === true) {
        throw new Error(
          `\`:exit\` is only allowed on the rightmost compound: ${selector}`
        );
      }
    }

    return { chain, message: finalMessage };
  });
}

function matchStep(node: AstValue, step: Step): boolean {
  /* v8 ignore next 3 -- defensive guard; AST nodes are always objects */
  if (!isAstNode(node)) {
    return false;
  }

  if (node.type !== step.type) {
    return false;
  }

  for (const attr of step.attrs) {
    if (!attr(node)) {
      return false;
    }
  }

  return true;
}

function parentOf(node: AstNode): AstNode[] {
  const { parent } = node;

  return parent === undefined || parent === null ? [] : [parent];
}

function ancestorsOf(node: AstNode): AstNode[] {
  const ancestors: AstNode[] = [];
  let anc: AstNode | null | undefined = node.parent;

  while (anc !== undefined && anc !== null) {
    ancestors.push(anc);
    anc = anc.parent;
  }

  return ancestors;
}

/**
 * Per combinator, returns the candidate nodes for matching the next step
 * (nearest first).
 */
const COMBINATOR_CANDIDATES: Record<Combinator, (node: AstNode) => AstNode[]> =
  {
    child: parentOf,
    descendant: ancestorsOf,
  };

function matchFrom(node: AstNode, chain: Step[], i: number): boolean {
  if (i >= chain.length) {
    return true;
  }

  if (i === 0) {
    return matchStep(node, chain[0]) && matchFrom(node, chain, 1);
  }

  /* v8 ignore next -- combinator is always set on non-leftmost chain steps */
  const comb: Combinator = chain[i - 1].combinator ?? "descendant";

  return COMBINATOR_CANDIDATES[comb](node).some(
    (candidate) =>
      matchStep(candidate, chain[i]) && matchFrom(candidate, chain, i + 1)
  );
}

/**
 * Checks whether a node matches the selector's step chain (the rightmost step
 * is the target node).
 *
 * @param node - The AST node to match
 * @param chain - The step chain of the parsed selector
 * @returns True if it matches
 */
export function matchChain(node: AstNode, chain: Step[]): boolean {
  return matchFrom(node, chain, 0);
}

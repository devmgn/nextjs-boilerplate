type Combinator = "child" | "descendant";

/**
 * Oxlint のビジターから渡る AST ノード。セレクタが参照する範囲
 * （type / parent / 任意の子プロパティ）だけを表明する。
 */
interface AstNode {
  readonly type: string;
  readonly parent?: AstNode | null;
}

/** AST ノードを任意キーで読むためのビュー。値は AstValue に限る。 */
interface AstRecord {
  readonly [key: string]: AstValue;
}

/** AST ノードが保持しうる値。セレクタの属性比較が扱う範囲。 */
type AstValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | AstNode
  | readonly AstValue[];

/** セレクタのリテラル（`[a="x"]` の右辺）が取りうる値。 */
type LiteralValue = string | number | boolean | null;

/** `no-restricted-syntax` が受け取るオブジェクト形式のオプション。 */

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

/** 任意キーで読めるオブジェクトかを判定する。値は AstValue として扱う。 */
function isAstRecord(value: AstValue): value is AstNode & AstRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** AST ノードの任意プロパティを読む。 */
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

function parseLiteral(raw: string): LiteralValue {
  if (
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith('"') && raw.endsWith('"'))
  ) {
    return raw.slice(1, -1);
  }
  if (raw === "true") {
    return true;
  }
  if (raw === "false") {
    return false;
  }
  if (raw === "null") {
    return null;
  }
  if (raw.length > 0 && !Number.isNaN(Number(raw))) {
    return Number(raw);
  }
  return raw;
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

function parseBranch(input: string): Step[] {
  const ltr: Step[] = [];
  let pending: Combinator | null = null;
  let buf = "";
  let depth = 0;
  let i = 0;

  const flushCompound = () => {
    const text = buf.trim();
    buf = "";
    if (text.length === 0) {
      return;
    }
    const step = parseCompound(text);
    step.combinator = pending;
    pending = null;
    ltr.push(step);
  };

  while (i < input.length) {
    const c = input[i];
    if (c === "[") {
      depth += 1;
      buf += c;
      i += 1;
    } else if (c === "]") {
      depth -= 1;
      buf += c;
      i += 1;
    } else if (depth === 0 && (c === " " || c === "\t" || c === ">")) {
      flushCompound();
      let comb: Combinator = "descendant";
      while (
        i < input.length &&
        (input[i] === " " || input[i] === "\t" || input[i] === ">")
      ) {
        if (input[i] === ">") {
          comb = "child";
        }
        i += 1;
      }
      pending = comb;
    } else {
      buf += c;
      i += 1;
    }
  }
  flushCompound();

  return ltr.toReversed();
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

export function compileOption(
  selector: string,
  message: string | undefined
): Compiled[] {
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

function matchFrom(node: AstNode, chain: Step[], i: number): boolean {
  if (i >= chain.length) {
    return true;
  }
  if (i === 0) {
    if (!matchStep(node, chain[0])) {
      return false;
    }
    return matchFrom(node, chain, 1);
  }

  /* v8 ignore next -- combinator is always set on non-leftmost chain steps */
  const comb: Combinator = chain[i - 1].combinator ?? "descendant";
  const { parent } = node;

  if (comb === "child") {
    if (parent === undefined || parent === null) {
      return false;
    }
    if (!matchStep(parent, chain[i])) {
      return false;
    }
    return matchFrom(parent, chain, i + 1);
  }

  let anc: AstNode | null | undefined = parent;
  while (anc !== undefined && anc !== null) {
    if (matchStep(anc, chain[i]) && matchFrom(anc, chain, i + 1)) {
      return true;
    }
    anc = anc.parent;
  }
  return false;
}

export function matchChain(node: AstNode, chain: Step[]): boolean {
  return matchFrom(node, chain, 0);
}

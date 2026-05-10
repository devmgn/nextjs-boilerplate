import type { Rule, Visitor } from "@oxlint/plugins";

type Combinator = "child" | "descendant";

type AttrMatcher = (node: unknown) => boolean;

interface Step {
  type: string;
  attrs: AttrMatcher[];
  // Combinator that links this step to the previous one in source-reading order.
  // After reversing into a parent-walk chain (chain[0] = rightmost), chain[i].combinator
  // describes how chain[i] (closer to leaf) relates to chain[i+1] (closer to root).
  combinator?: Combinator;
  // True when the compound ends with `:exit`. Only meaningful on chain[0] (the matched node).
  isExit?: boolean;
}

interface Compiled {
  chain: Step[];
  message: string;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function getByPath(node: unknown, path: string[]): unknown {
  let cur: unknown = node;
  for (const k of path) {
    if (!isObjectRecord(cur)) {
      return undefined;
    }
    cur = cur[k];
  }
  return cur;
}

function getParent(node: unknown): unknown {
  /* v8 ignore next 3 -- defensive guard; matchFrom always passes object nodes */
  if (!isObjectRecord(node)) {
    return undefined;
  }
  return node.parent;
}

function parseLiteral(raw: string): unknown {
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
      return typeof v === "string" && re.test(v);
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
  let pending: Combinator | undefined = undefined;
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
    pending = undefined;
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

function compileOption(
  selector: string,
  message: string | undefined,
): Compiled[] {
  const finalMessage = message ?? `Using "${selector}" is restricted.`;
  return parseSelectorGroup(selector).map((chain) => {
    for (let i = 1; i < chain.length; i += 1) {
      if (chain[i].isExit === true) {
        throw new Error(
          `\`:exit\` is only allowed on the rightmost compound: ${selector}`,
        );
      }
    }
    return { chain, message: finalMessage };
  });
}

function matchStep(node: unknown, step: Step): boolean {
  /* v8 ignore next 3 -- defensive guard; AST nodes are always objects */
  if (!isObjectRecord(node)) {
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

function matchFrom(node: unknown, chain: Step[], i: number): boolean {
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
  const parent = getParent(node);

  if (comb === "child") {
    if (parent === undefined || parent === null) {
      return false;
    }
    if (!matchStep(parent, chain[i])) {
      return false;
    }
    return matchFrom(parent, chain, i + 1);
  }

  let anc: unknown = parent;
  while (anc !== undefined && anc !== null) {
    if (matchStep(anc, chain[i]) && matchFrom(anc, chain, i + 1)) {
      return true;
    }
    anc = getParent(anc);
  }
  return false;
}

function matchChain(node: unknown, chain: Step[]): boolean {
  return matchFrom(node, chain, 0);
}

const rule: Rule = {
  meta: { schema: false },
  create(context) {
    const compiled: Compiled[] = [];
    for (const opt of context.options) {
      if (typeof opt === "string") {
        compiled.push(...compileOption(opt, undefined));
      } else if (isObjectRecord(opt) && typeof opt.selector === "string") {
        const message =
          typeof opt.message === "string" ? opt.message : undefined;
        compiled.push(...compileOption(opt.selector, message));
      }
    }

    const byKey = new Map<string, Compiled[]>();
    for (const c of compiled) {
      const [head] = c.chain;
      const key = head.isExit === true ? `${head.type}:exit` : head.type;
      const list = byKey.get(key);
      if (list === undefined) {
        byKey.set(key, [c]);
      } else {
        list.push(c);
      }
    }

    const visitors: Visitor = {};
    for (const [key, configs] of byKey) {
      visitors[key] = (node) => {
        for (const cfg of configs) {
          if (matchChain(node, cfg.chain)) {
            context.report({ node, message: cfg.message });
          }
        }
      };
    }
    return visitors;
  },
};

export default rule;

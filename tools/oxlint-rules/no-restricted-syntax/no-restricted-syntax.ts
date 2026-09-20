import type { AstNode, Compiled } from "./utils/selector-matcher/index.ts";
import type { Rule, Visitor } from "@oxlint/plugins";
import { compileOption, matchChain } from "./utils/selector-matcher/index.ts";

/** `no-restricted-syntax` が受け取るオブジェクト形式のオプション。 */
interface SelectorOption {
  readonly selector: string;
  readonly message?: string;
}

function isStringOption(opt: unknown): opt is string {
  return typeof opt === "string";
}

function isSelectorOption(opt: unknown): opt is SelectorOption {
  if (typeof opt !== "object" || opt === null || !("selector" in opt)) {
    return false;
  }
  if (typeof opt.selector !== "string") {
    return false;
  }
  return !("message" in opt) || typeof opt.message === "string";
}

const rule: Rule = {
  meta: { schema: false },
  create(context) {
    const compiled: Compiled[] = [];
    for (const opt of context.options) {
      if (isStringOption(opt)) {
        compiled.push(...compileOption(opt, undefined));
      } else if (isSelectorOption(opt)) {
        compiled.push(...compileOption(opt.selector, opt.message));
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

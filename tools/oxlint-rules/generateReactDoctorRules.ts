import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { selectReactDoctorRules } from "./reactDoctorRules.ts";

// oxlint.config.ts のマーカー間に react-doctor のルール一覧を書き出す。
// 選定ロジックは reactDoctorRules.ts が持つ。

const CONFIG_PATH = "oxlint.config.ts";
const START_MARKER = "    // react-doctor:start\n";
const END_MARKER = "    // react-doctor:end\n";

function renderRules(rules: Record<string, "error">): string {
  return Object.entries(rules)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([name, severity]) => `    "${name}": "${severity}",\n`)
    .join("");
}

function main(): void {
  const source = readFileSync(CONFIG_PATH, "utf8");
  const start = source.indexOf(START_MARKER);
  const end = source.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      `${CONFIG_PATH} に react-doctor:start / react-doctor:end マーカーが見つかりません。`,
    );
  }

  const rules = selectReactDoctorRules();
  const next =
    source.slice(0, start + START_MARKER.length) +
    renderRules(rules) +
    source.slice(end);

  writeFileSync(CONFIG_PATH, next);
  // 長いルール名は oxfmt の折り返し規則に合わないため、生成後に整形まで済ませる。
  execFileSync("./node_modules/.bin/oxfmt", ["--write", CONFIG_PATH]);
  console.warn(
    `${CONFIG_PATH}: react-doctor ルール ${Object.keys(rules).length} 件を書き出しました。`,
  );
}

main();

---
status: accepted
date: 2026-05-27
---

# ディレクトリ構成の判定軸

## Context

ディレクトリ構成ルール (`.claude/rules/directory-structure.md`) は #2823 で初版を整備したが、その後の運用で次の揺れが累積していた:

- `utils/` vs `lib/` の判定軸（「副作用の有無」）が曖昧で、`setTimeout` を使う `debounce` や `process.env` を読む `runtime` が `utils/` に置かれ続けるなどルールと実態が乖離
- グルーピング配下のコンポーネントがフラットファイル (`form/Field.tsx`) と専用ディレクトリ (`Card/Card.tsx + index.ts`) で不揃い
- `app/` 配下の `_components/` などにルールが波及していない
- server action (`form/action.ts`) や schema (`form/schema.ts`) がルート直下に置かれ、種類軸を経由していない

今日の grill セッションで上記をすべて潰し、6 点の判定軸を一括で固定する。詳細ルールは [`/.claude/rules/directory-structure.md`](../../.claude/rules/directory-structure.md) を参照。

## 決定

1. **`utils/` vs `lib/` の判定軸は「移植性 / プロジェクト固有性」**。`utils/` はプロジェクトの外に持ち出してそのまま動く汎用ロジック（標準 API への依存は OK）、`lib/` はこのアプリ固有の設定・統合・グルー。

2. **トップレベルは 3 軸で分類する**:
   - 契約層: `api/`, `types/`
   - 汎用: `components/`, `hooks/`, `utils/`
   - アプリ固有: `lib/`, `providers/`, `mocks/`, `proxy.ts`, `env.ts`

3. **全機能を 1 ディレクトリ + `index.ts` に統一**。グルーピング配下のフラットファイル配置（`form/Field.tsx` のような単発置き）は許容しない。「育ったらディレクトリ化」の昇格判断を撲滅する。

4. **`app/` 配下にも同じ 1 機能 1 ディレクトリを適用**。例外は Next.js のフレームワーク規約ファイル（`page.tsx` / `layout.tsx` / `route.ts` / `loading.tsx` / `error.tsx` / `not-found.tsx` / `template.tsx` / `default.tsx`）のみ。

5. **`_actions/` を `app/` 配下の種類軸に追加**。`"use server"` を含むコードは `_lib/` から分離し、レビュー観点を明確にする。action 固有のバリデータ・ヘルパーは `_actions/<name>/` 配下に同居させ、複数 action で共有するヘルパーのみ `_lib/` に切り出す。

6. **ルート固有 → `src/` への昇格は「2 ルート目で使うことが確定した時点」**。同じ PR に 2 ルート目の使用が含まれるなら事前昇格 OK。「将来使うかもしれない」推測昇格は禁止。

## 却下した代替案

- **`utils/` vs `lib/` を副作用の有無で振り分ける**: 元のルール。だが `setTimeout` / `process.env` を使う `debounce` や `runtime` を `lib/` に押し込むことになり、移植可能な汎用コードと「アプリのグルー」が混在して `lib/` の意味が薄まる。
- **コンポーネント単体は閾値ベースで昇格（実装+stories だけならフラット、utils が出たらディレクトリ化）**: 状況依存の判定は毎回迷うコストが発生する。`Foo.tsx` → `Foo/Foo.tsx` のリファクタ自体を発生させない方が運用負荷が低い。
- **`api/` を `lib/api/` に統合**: 「top-level を増やさない」大方針には沿うが、OpenAPI 由来の生成物と手書きグルーが同じ `lib/` 配下に混在し、「再生成可能 vs 手書き」の境界が読み解きにくくなる。`api/` は契約層として独立させる方が分離度が高い。
- **server action を `_lib/` に同居**: 種類軸を増やさずに済むが、`"use server"` の重さ（サーバ実行・副作用・セキュリティ観点）と validator/schema のような軽い helper を同じ軸で扱うことになる。`_actions/` 独立で「このディレクトリの中身はすべて server action」と保証できる方が読みやすい。

## Consequences

**ポジティブ**

- 1 機能 1 ディレクトリ強制で「ファイル → ディレクトリ昇格」のリファクタ PR が発生しなくなる
- `_actions/` 分離により、server action のセキュリティ・副作用レビュー範囲が `app/**/_actions/**` の grep で網羅できる
- 「移植性軸」採用により `utils/` が「他プロジェクトに持ち出せるか」のテストで機械的に判定できる
- 3 軸分類が明示されたことで、新しいトップレベル候補（例: `services/`, `domain/`）が出たときに「どの軸に属するか」で議論できる
- ルートディレクトリ命名規則 + 1 機能 1 ディレクトリにより、`Foo/Foo.tsx + index.ts` が機械的に決まり、PR レビューで命名のばらつきを指摘するコストが消える

**ネガティブ / 注意点**

- ファイル数・ディレクトリ数が増える（特に `components/form/` 配下のような細粒度コンポーネント群）。1 機能あたり最低 2 ファイル（実装 + `index.ts`）になる
- `_actions/` を新設したため、既存ルート (`app/(sandbox)/form/`) の `action.ts` を移動する破壊的変更が必要
- 「2 ルート目で使うことが確定した時点」での昇格は、当該 PR にコロケーション解除 + `src/` への移動が同居するため diff が広くなる
- action 固有 helper を `_actions/<name>/` に同居させる運用は、複数 action 間でうっかりコピペが発生しやすい。共有候補が見えた時点で `_lib/` への抽出を検討する規律が必要

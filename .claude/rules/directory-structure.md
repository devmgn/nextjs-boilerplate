# Directory Structure Rules

## 大方針

1. ルート固有は `app/` 配下にコロケーション、共有は `src/` 直下の種類軸で分類
2. ドメイン名のディレクトリは作らない
3. top-level を増やさない

## `src/` トップレベル

トップレベルは **3 軸**で分類する:

- **契約層**: 再生成可能な、外部仕様に従う層（`api/`, `types/`）
- **汎用**: プロジェクト外に持ち出せる汎用 UI / ロジック（`components/`, `hooks/`, `utils/`）
- **アプリ固有**: このアプリの設定・統合・グルー（`lib/`, `providers/`, `mocks/`, `proxy.ts`, `env.ts`）

| ディレクトリ / ファイル | 軸 | 役割 |
| --- | --- | --- |
| `app/` | - | Next.js App Router |
| `api/` | 契約層 | OpenAPI 生成物 + その薄いコンシューマー拡張（apiClient / queryOptions など） |
| `types/` | 契約層 | 型ヘルパー・グローバル型拡張（.d.ts 含む） |
| `components/` | 汎用 | 汎用 UI コンポーネント |
| `hooks/` | 汎用 | 汎用 React hooks |
| `utils/` | 汎用 | プロジェクト外に持ち出せる汎用ロジック |
| `lib/` | アプリ固有 | このアプリ固有の設定・統合・グルー |
| `providers/` | アプリ固有 | アプリ全体に被せる Context Provider |
| `mocks/` | アプリ固有 | MSW handlers・各環境エントリ |
| `env.ts` | アプリ固有 | 環境変数の型付き定義 |
| `proxy.ts` | アプリ固有 | Next.js middleware 相当 |
| `instrumentation-client.ts` | アプリ固有 | Next.js instrumentation hook |

ディレクトリ間の import 方向（汎用 → アプリ固有を参照しない等）は `fallow.toml` の `boundaries` が強制する。

## `utils/` vs `lib/`

**移植性 / プロジェクト固有性**で振り分ける。

- `utils/`: プロジェクト外に持ち出しても動く汎用ロジック。標準 API（`setTimeout`、`AbortController`、`process.env`、`window` など）への依存は OK。副作用そのものは判定軸にしない
- `lib/`: このアプリ固有の設定・統合・グルー。具体例: `QueryClient` の設定、proxy ミドルウェア、Web Vitals の送信先、スタイル設定の集約

判定の補助線:

- 他プロジェクトに `cp -r` してそのまま動くか？ → 動くなら `utils/`、動かないなら `lib/`
- アプリ固有の設定値・エンドポイント・トークン名・ロガー実装に依存しているか？ → していれば `lib/`

## ファイル / ディレクトリ命名規則

**役割を問わず、すべて kebab-case で統一する。** ディレクトリ名・ファイル名の両方が対象。

| 対象 | 例 |
| --- | --- |
| コンポーネント | `components/loading-overlay/loading-overlay.tsx` |
| 機能 entrypoint | `hooks/use-media-query/use-media-query.ts` |
| グルーピング | `utils/is/is-key-of/` |
| 付随ファイル | `button.stories.tsx` / `button.test.tsx` / `use-toggle.test-d.ts` |

export する識別子の命名は従来どおり（コンポーネントは PascalCase、hook は `useXxx`、関数は camelCase）。**ファイル名と識別子名は一致させなくてよい。**

```
components/loading-overlay/loading-overlay.tsx   →  export function LoadingOverlay()
hooks/use-media-query/use-media-query.ts         →  export function useMediaQuery()
```

`oxlint` の `unicorn/filename-case` と `github/filenames-match-regex` が強制する。前者は camelCase も PascalCase も弾き、後者は先頭大文字とドット区切り 2 つ以上を弾く。

例外は生成物とフレームワーク規約ファイルのみ:

- `src/api/openapi/**`（OpenAPI 生成物。`ignorePatterns` で除外）
- Next.js 規約ファイル（`page.tsx` / `layout.tsx` など。元々小文字）

`index.ts` の有無による役割の区別は残る:

- そのディレクトリが `index.ts` から関数/オブジェクト/Provider を公開している → **機能 entrypoint**
- 複数の機能を束ねる中継で `index.ts` を持たない → **グルーピング**

## 1機能1ディレクトリ

機能 entrypoint・コンポーネント単体・グルーピング配下のすべての機能（コンポーネント / hook / 関数 / queries / mutations …）は **1機能 = 1ディレクトリ + `index.ts`** で構成する。フラットファイル配置（`form/field.tsx` のように単発ファイルを直接置く形）は許容しない。

理由: 育ったときの「ファイル → ディレクトリ昇格」リファクタを撲滅し、判断を迷わせない。関連の強い実装群のみ系統サブディレクトリで束ねる。グルーピングディレクトリ直下に `index.ts` (barrel) は置かない。

```
utils/
  debounce/                  # 機能 entrypoint
    debounce.ts
    index.ts
  is/                        # グルーピング（index.ts なし）
    is-function/
      is-function.ts
      index.ts
    is-key-of/
    is-value-of/

lib/
  get-query-client/          # 機能 entrypoint
    get-query-client.ts
    index.ts
    config/                  # グルーピング
      query-client-config.ts
  proxy/                     # グルーピング
    add-custom-header/
    request-logger/
    response-logger/

components/
  card/                      # コンポーネント単体
    card.tsx
    index.ts
  form/                      # グルーピング（index.ts なし）
    field/
      field.tsx
      field.stories.tsx
      index.ts
    input/
      input.tsx
      input.stories.tsx
      index.ts
    label/
      label.tsx
      label.stories.tsx
      index.ts

hooks/
  use-debounced-callback/    # 機能 entrypoint
  storage/                   # グルーピング
    use-local-storage/
    use-session-storage/
    use-web-storage/
    utils/                   # 系統内ローカル utils
      web-storage-store/
```

## コンポーネント / フック内部のローカル `utils/`

コンポーネントやフック配下に内部実装を束ねる `utils/` サブディレクトリは許容する。グルーピングディレクトリなので `index.ts` は置かず、配下の機能ディレクトリで instance を生成する。

```
components/
  loading-overlay/
    loading-overlay.tsx
    index.ts
    utils/                   # グルーピング（index.ts なし）
      loading-store/         # 機能 entrypoint
        loading-store.ts     # factory
        index.ts             # instance 生成
```

## `app/` 配下のコロケーション

ルート固有の部品はアンダースコア private folder + 種類軸 + 1機能1ディレクトリで配置する。

```
app/
  posts/
    _components/
      post-card/
        post-card.tsx
        index.ts
    _hooks/
      use-post-form/
        use-post-form.ts
        index.ts
    _lib/
      post-validator/
        post-validator.ts
        index.ts
    _actions/
      create-post/
        create-post.ts         # "use server"
        index.ts
    page.tsx
  (settings)/
    _providers/
      settings-provider/
        settings-provider.tsx
        index.ts
    _components/
      settings-nav/
        settings-nav.tsx
        index.ts
    account/
      page.tsx
```

- アンダースコア `_` プレフィックス必須（Next.js のルーティング対象から除外）
- 種類軸: `_components/` `_hooks/` `_lib/` `_utils/` `_providers/` `_actions/`
- route group `(group)` との併用 OK
- ルートディレクトリ名はケバブケース許容（URL 慣習に従う）
- **Next.js 規約ファイルだけはルート直下のフラットファイル許容**: `page.tsx` / `layout.tsx` / `route.ts` / `loading.tsx` / `error.tsx` / `not-found.tsx` / `template.tsx` / `default.tsx`
- それ以外（schema、action、コンポーネント、フックなど）は必ず種類軸ディレクトリ配下に置き、1機能1ディレクトリ+`index.ts` を守る
- **action 固有のバリデータ・ヘルパーは `_actions/<name>/` 配下に同居させる**。複数 action で共有するヘルパーのみ `_lib/` に切り出す（共有候補が 2 action 以上で確定してから抽出）

## ルート固有 vs 共有の判定

- 最初は必ず `app/(route)/_*` に置く
- 2 ルート目で使うことが**確定した時点**で `src/*` に昇格（同じ PR で 2 ルート目の使用が含まれるなら事前昇格 OK）
- 「将来使うかもしれない」推測昇格は禁止。1 ルートで完結している間は app/ から動かさない

## Provider の配置

| シナリオ                             | 配置先                    |
| ------------------------------------ | ------------------------- |
| アプリ全体（`app/layout.tsx`）で使う | `src/providers/`          |
| 複数ルートグループで使う             | `src/providers/`          |
| 単一ルートグループ内で完結           | `app/(group)/_providers/` |
| 単一ルートのみ                       | `app/route/_providers/`   |

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

| ディレクトリ / ファイル     | 軸         | 役割                                                                         |
| --------------------------- | ---------- | ---------------------------------------------------------------------------- |
| `app/`                      | -          | Next.js App Router                                                           |
| `api/`                      | 契約層     | OpenAPI 生成物 + その薄いコンシューマー拡張（apiClient / queryOptions など） |
| `types/`                    | 契約層     | 型ヘルパー・グローバル型拡張（.d.ts 含む）                                   |
| `components/`               | 汎用       | 汎用 UI コンポーネント                                                       |
| `hooks/`                    | 汎用       | 汎用 React hooks                                                             |
| `utils/`                    | 汎用       | プロジェクト外に持ち出せる汎用ロジック                                       |
| `lib/`                      | アプリ固有 | このアプリ固有の設定・統合・グルー                                           |
| `providers/`                | アプリ固有 | アプリ全体に被せる Context Provider                                          |
| `mocks/`                    | アプリ固有 | MSW handlers・各環境エントリ                                                 |
| `env.ts`                    | アプリ固有 | 環境変数の型付き定義                                                         |
| `proxy.ts`                  | アプリ固有 | Next.js middleware 相当                                                      |
| `instrumentation-client.ts` | アプリ固有 | Next.js instrumentation hook                                                 |

## `utils/` vs `lib/`

**移植性 / プロジェクト固有性**で振り分ける。

- `utils/`: プロジェクト外に持ち出しても動く汎用ロジック。標準 API（`setTimeout`、`AbortController`、`process.env`、`window` など）への依存は OK。副作用そのものは判定軸にしない
- `lib/`: このアプリ固有の設定・統合・グルー。具体例: `QueryClient` の設定、proxy ミドルウェア、Web Vitals の送信先、スタイル設定の集約

判定の補助線:

- 他プロジェクトに `cp -r` してそのまま動くか？ → 動くなら `utils/`、動かないなら `lib/`
- アプリ固有の設定値・エンドポイント・トークン名・ロガー実装に依存しているか？ → していれば `lib/`

## ディレクトリ命名規則

ディレクトリの**役割**で命名を選ぶ。

| 役割               | 単一語     | 複合語         |
| ------------------ | ---------- | -------------- |
| コンポーネント単体 | PascalCase | PascalCase     |
| 機能 entrypoint    | 小文字     | キャメルケース |
| グルーピング       | 小文字     | ケバブケース   |

判定:

- そのディレクトリが `index.ts` から関数/オブジェクト/Provider を公開している → **機能 entrypoint**
- 複数の機能を束ねる中継で `index.ts` を持たない → **グルーピング**

## 1機能1ディレクトリ

機能 entrypoint・コンポーネント単体・グルーピング配下のすべての機能（コンポーネント / hook / 関数 / queries / mutations …）は **1機能 = 1ディレクトリ + `index.ts`** で構成する。フラットファイル配置（`form/Field.tsx` のように単発ファイルを直接置く形）は許容しない。

理由: 育ったときの「ファイル → ディレクトリ昇格」リファクタを撲滅し、判断を迷わせない。関連の強い実装群のみ系統サブディレクトリで束ねる。グルーピングディレクトリ直下に `index.ts` (barrel) は置かない。

```
utils/
  debounce/                  # 機能 entrypoint
    debounce.ts
    index.ts
  is/                        # グルーピング（index.ts なし）
    isFunction/
      isFunction.ts
      index.ts
    isKeyOf/
    isValueOf/

lib/
  getQueryClient/            # 機能 entrypoint
    getQueryClient.ts
    index.ts
    config/                  # グルーピング
      queryClientConfig.ts
  proxy/                     # グルーピング
    addCustomHeader/
    requestLogger/
    responseLogger/

components/
  Card/                      # コンポーネント単体
    Card.tsx
    index.ts
  form/                      # グルーピング（index.ts なし）
    Field/
      Field.tsx
      Field.stories.tsx
      index.ts
    Input/
      Input.tsx
      Input.stories.tsx
      index.ts
    Label/
      Label.tsx
      Label.stories.tsx
      index.ts

hooks/
  useDebouncedCallback/      # 機能 entrypoint
  storage/                   # グルーピング
    useLocalStorage/
    useSessionStorage/
    useWebStorage/
    utils/                   # 系統内ローカル utils
      webStorageStore/
```

## コンポーネント / フック内部のローカル `utils/`

コンポーネントやフック配下に内部実装を束ねる `utils/` サブディレクトリは許容する。グルーピングディレクトリなので `index.ts` は置かず、配下の機能ディレクトリで instance を生成する。

```
components/
  LoadingOverlay/
    LoadingOverlay.tsx
    index.ts
    utils/                   # グルーピング（index.ts なし）
      loadingStore/          # 機能 entrypoint
        loadingStore.ts      # factory
        index.ts             # instance 生成
```

## `app/` 配下のコロケーション

ルート固有の部品はアンダースコア private folder + 種類軸 + 1機能1ディレクトリで配置する。

```
app/
  posts/
    _components/
      PostCard/
        PostCard.tsx
        index.ts
    _hooks/
      usePostForm/
        usePostForm.ts
        index.ts
    _lib/
      postValidator/
        postValidator.ts
        index.ts
    _actions/
      createPost/
        createPost.ts          # "use server"
        index.ts
    page.tsx
  (settings)/
    _providers/
      SettingsProvider/
        SettingsProvider.tsx
        index.ts
    _components/
      SettingsNav/
        SettingsNav.tsx
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

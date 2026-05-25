# Directory Structure Rules

## 大方針

1. ルート固有は `app/` 配下にコロケーション、共有は `src/` 直下の種類軸で分類
2. ドメイン名のディレクトリは作らない
3. top-level を増やさない

## `src/` トップレベル

| ディレクトリ / ファイル     | 役割                                          |
| --------------------------- | --------------------------------------------- |
| `app/`                      | Next.js App Router                            |
| `api/`                      | OpenAPI 生成クライアント・queryOptions 定義   |
| `components/`               | 汎用 UI コンポーネント                        |
| `hooks/`                    | 汎用 React hooks                              |
| `utils/`                    | 純粋関数のユーティリティ（副作用なし）        |
| `lib/`                      | 副作用/外部依存あり・アプリ固有ラッパー・設定 |
| `providers/`                | アプリ全体に被せる Context Provider           |
| `types/`                    | 型ヘルパー・グローバル型拡張（.d.ts 含む）    |
| `mocks/`                    | MSW handlers・各環境エントリ                  |
| `env.ts`                    | 環境変数の型付き定義                          |
| `proxy.ts`                  | Next.js middleware 相当                       |
| `instrumentation-client.ts` | Next.js instrumentation hook                  |

## `utils/` vs `lib/`

**副作用の有無**で振り分ける。

- `utils/`: 純粋関数（入力→出力のみ、外部状態の書き込みなし）
- `lib/`: 副作用/外部依存あり、アプリ固有のラッパー、ストア、計測、設定

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

機能 entrypoint は 1機能 = 1ディレクトリ。関連の強い実装群のみ系統サブディレクトリで束ねる。グルーピングディレクトリ直下に `index.ts` (barrel) は置かない。

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
  form/                      # グルーピング
    Field.tsx
    Input.tsx
    Label.tsx

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

ルート固有の部品はアンダースコア private folder + 種類軸で配置する。

```
app/
  posts/
    _components/
      PostCard.tsx
    _hooks/
      usePostForm.ts
    _lib/
      postValidator.ts
    page.tsx
  (settings)/
    _providers/
      SettingsProvider.tsx
    _components/
      SettingsNav.tsx
    account/
      page.tsx
```

- アンダースコア `_` プレフィックス必須（Next.js のルーティング対象から除外）
- 種類軸: `_components/` `_hooks/` `_lib/` `_utils/` `_providers/`
- route group `(group)` との併用 OK
- ルートディレクトリ名はケバブケース許容（URL 慣習に従う）

## ルート固有 vs 共有の判定

- 最初は必ず `app/(route)/_*` に置く
- 2 ルート目で使われた瞬間に `src/*` に昇格

## Provider の配置

| シナリオ                             | 配置先                    |
| ------------------------------------ | ------------------------- |
| アプリ全体（`app/layout.tsx`）で使う | `src/providers/`          |
| 複数ルートグループで使う             | `src/providers/`          |
| 単一ルートグループ内で完結           | `app/(group)/_providers/` |
| 単一ルートのみ                       | `app/route/_providers/`   |

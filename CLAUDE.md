# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## 重要な指示

**このプロジェクトでは、Claude Codeとのやり取りは全て日本語で行ってください。**

## プロジェクト概要

Next.js 15 ボイラープレート:
- TypeScript (strict mode, noErrorTruncation有効)
- React 19 (実験的React Compiler搭載)
- Turbopack (開発用)
- Tailwind CSS v4 (PostCSSプラグイン)
- TanStack Query (データフェッチング)
- React Hook Form + Zod (フォーム処理)
- Radix UI (アクセシブルなコンポーネント)
- Vitest (Storybook統合テスト)
- Biome (主要フォーマッター/リンター)
- Hono (ミドルウェアフレームワーク)

## 環境設定

- **Node.js**: 22.16.0 (package.jsonで固定)
- **パッケージマネージャー**: Yarn 4.9.2 (Berry)
- **環境変数**: `.env.development`、`.env.test`、`.env.local`で管理
- **環境変数スキーマ**: `src/schemas/env.schema.ts`で定義
- **設定管理**: `src/config/env.ts`で環境変数を型安全に使用

## 必須コマンド

### 開発
```bash
yarn dev           # Turbopackで開発サーバー起動
yarn build         # プロダクションビルド
yarn start         # プロダクションサーバー起動
yarn analyze       # バンドルサイズ分析 (ANALYZE=true yarn build)
```

### コード品質
```bash
yarn lint          # Next.js ESLintとBiome両方を実行
yarn lint:next     # Next.js ESLint (自動修正付き)
yarn lint:biome    # Biomeチェック (自動修正付き)
yarn check-types   # TypeScript型チェック
yarn knip          # 未使用の依存関係/エクスポートを検出
```

### テスト
```bash
yarn test          # 全テストを1回実行
yarn test:watch    # ウォッチモードでテスト実行
yarn test:update   # テストスナップショット更新
yarn test:coverage # カバレッジレポート付きテスト実行

# 特定のテストファイルを実行
yarn test path/to/file.test.tsx

# パターンに一致するテストを実行
yarn test --grep "pattern"
```

### Storybook
```bash
yarn storybook       # Storybook開発サーバー起動
yarn build-storybook # Storybookビルド
yarn chromatic       # ビジュアルリグレッションテスト実行
```

### API生成
```bash
yarn generate-api        # OpenAPI仕様からTypeScriptクライアント生成
yarn generate-api:clean  # クリーン後に再生成
```

## アーキテクチャ

### ディレクトリ構造
```
src/
├── api/          # 生成されたAPIクライアントとクエリ関数
│   ├── openapi/  # 自動生成（編集禁止）
│   └── queries/  # TanStack Queryフック
├── app/          # Next.js App Routerのページとレイアウト
├── components/   # 再利用可能なUIコンポーネント
├── config/       # アプリ設定（環境変数など）
├── features/     # 機能モジュール（ドメイン固有のコード）
├── hooks/        # カスタムReactフック
├── lib/          # サードパーティライブラリ設定
│   └── middlewares/ # Honoミドルウェア
├── mocks/        # MSWモックサーバー設定
├── providers/    # Reactコンテキストプロバイダー
├── schemas/      # Zodバリデーションスキーマ
├── types/        # TypeScript型定義
└── utils/        # ユーティリティ関数
```

### 主要パターン

1. **データフェッチング**: Query Keyファクトリーパターンを使用したTanStack Query
   - クエリ関数は `src/api/queries/` に配置
   - クエリキーは `@lukemorales/query-key-factory` で管理

2. **コンポーネント開発**: 
   - Storybookで独立して開発
   - スタイリングにTailwind Variantsを使用
   - アクセシブルなプリミティブにRadix UIを使用

3. **フォーム処理**: React Hook Form + Zod
   - スキーマは `src/schemas/` に配置
   - フォームコンポーネントは `useForm` とzodResolverを使用

4. **テスト戦略**:
   - コンポーネントと同じ場所にユニットテスト (`.test.tsx`)
   - コンポーネントの相互作用にStorybookテスト
   - APIモッキングにMSW (public/mockServiceWorker.js)
   - Vitestワークスペース: unitテストとStorybookテストを分離
   - カバレッジ除外: `*.d.ts`、`src/mocks/**`、`src/api/**`

5. **型安全性**:
   - 厳格なTypeScript設定
   - OpenAPI仕様から生成されたAPI型
   - ランタイムバリデーション用のZodスキーマ

## 開発ワークフロー

1. **プリコミットフック**: ステージングされたファイルに自動実行:
   - リンティング (Biome + ESLint)
   - 型チェック
   - 関連テスト

2. **インポート整理**: Biomeが自動的にインポートをソート

3. **コードスタイル**: 
   - Biomeがフォーマットを処理
   - Next.jsのページ/レイアウト以外はデフォルトエクスポート禁止
   - 名前付きエクスポートを推奨

4. **コンポーネントファイル**: 命名規則に従う:
   - コンポーネント: `ComponentName.tsx`
   - ストーリー: `ComponentName.stories.tsx`
   - テスト: `ComponentName.test.tsx`

## Linting/Formatting設定

### Biome設定
- インポート自動整理、属性・プロパティのソート
- react-useフックの依存関係チェック
- domains設定（next、project、react、test）でインポート順序管理
- パフォーマンス、スタイル、疑わしいコードの警告

### ESLint設定
- React Compiler推奨設定
- TanStack Query推奨設定
- Vitest推奨設定（`it`使用、トップレベルdescribe必須）

## 特殊な設定

1. **React Compiler**: babel-plugin-react-compilerで実験的に有効化
2. **Middleware**: Honoフレームワークでカスタムヘッダー、ログ機能実装
3. **ビルド分析**: `ANALYZE=true`環境変数でバンドルアナライザー有効化
4. **Chromatic**: GitHub ActionsでPRマージ時に自動デプロイ
5. **knip除外**: `src/app/forbidden.tsx`、`unauthorized.tsx`は無視設定

## 注意事項

- `src/api/openapi/`ディレクトリは自動生成されるため、**絶対に編集しない**
- 環境変数を追加する際は必ず`src/schemas/env.schema.ts`にスキーマを定義
- テスト実行時は`vitest.globalSetup.ts`と`vitest.setup.ts`が適用される
- MSWのワーカーファイルは`public/mockServiceWorker.js`に配置

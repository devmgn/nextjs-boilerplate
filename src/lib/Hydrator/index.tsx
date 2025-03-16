import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type {
  DefaultError,
  FetchQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

/**
 * Hydrator コンポーネントのプロパティ型定義
 * サーバーサイドでデータをプリフェッチし、クライアントサイドでハイドレーションするために使用
 */
type HydratorProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = React.PropsWithChildren<{
  /**
   * プリフェッチするクエリオプションの配列
   */
  fetchQueryOptions: FetchQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >[];
  /**
   * HydrationBoundary コンポーネントに渡す追加のプロパティ
   */
  hydrationBoundaryProps?: React.ComponentPropsWithoutRef<
    typeof HydrationBoundary
  >;
}>;

/**
 * サーバーサイドでデータをプリフェッチし、クライアントサイドでハイドレーションするためのコンポーネント
 */
export async function Hydrator<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
>({
  fetchQueryOptions,
  hydrationBoundaryProps,
  children,
}: HydratorProps<TQueryFnData, TError, TData, TQueryKey>) {
  // サーバーサイドでのみ実行される QueryClient インスタンスを作成
  const queryClient = new QueryClient();

  try {
    // すべてのクエリを並行してプリフェッチ
    await Promise.all(
      fetchQueryOptions.map((options) => queryClient.prefetchQuery(options)),
    );

    // ハイドレーションステートを作成し、HydrationBoundary に渡す
    return (
      <HydrationBoundary
        state={dehydrate(queryClient)}
        {...hydrationBoundaryProps}
      >
        {children}
      </HydrationBoundary>
    );
  } finally {
    // QueryClient のリソースをクリーンアップ
    queryClient.clear();
  }
}

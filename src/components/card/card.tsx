import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const cardVariants = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-xs",
});

interface CardProps
  extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

/**
 * 角丸・ボーダー・シャドウ付きのコンテナ。関連コンテンツのグルーピング用。
 *
 * @param props - `div` 要素の属性。
 * @returns スタイル適用済みのカード要素。
 */
export function Card(props: CardProps) {
  const { className, ..._props } = props;

  return <div className={cardVariants(className)} {..._props} />;
}

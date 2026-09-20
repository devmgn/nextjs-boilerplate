import { z } from "zod";

const style = `
  font-size: 10px;
  padding-inline: 4px;
  border-radius: 8px;
  background-color: #3F51B5;
  color: #FFF;
`;

const metricSchema = z.object({
  name: z.string(),
  value: z.number(),
  rating: z.string(),
});

// 受け口。実行時には欠けた値が届きうるため Partial で受け、関数内で検証する。
// next/web-vitals の Metric は未インストールの web-vitals 由来で解決できないため、
// 検証スキーマ側を契約とする。
type IncomingMetric = Partial<z.input<typeof metricSchema>>;

/** 計測値を検証してコンソールへ出す。スキーマに合わない値は黙って捨てる。 */
export function reportWebVital(metric: IncomingMetric): void {
  const result = metricSchema.safeParse(metric);
  if (!result.success) {
    return;
  }

  const { name, value, rating } = result.data;
  // Web Vitals の計測結果は info で出す
  // oxlint-disable-next-line no-console
  console.info(
    `%c [Web Vitals]: ${name}: ${value} / Rating: ${rating}`,
    style,
    metric
  );
}

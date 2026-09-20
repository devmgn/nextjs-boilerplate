import type { useReportWebVitals } from "next/web-vitals";
import { z } from "zod";

const style = `
  font-size: 10px;
  padding-inline: 4px;
  border-radius: 8px;
  background-color: #3F51B5;
  color: #FFF;
`;

// useReportWebVitals が計測値として渡す型。
type WebVitalMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

// 受け口。実行時には Next の型より欠けた値が届きうるため Partial で受け、
// 関数内で検証する。
type IncomingMetric = Partial<WebVitalMetric>;

const metricSchema = z.object({
  name: z.string(),
  value: z.number(),
  rating: z.string(),
});

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

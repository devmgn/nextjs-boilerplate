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

// Input type. Values may be missing at runtime, so accept Partial and validate inside the function.
// next/web-vitals' Metric comes from the uninstalled web-vitals package and cannot be resolved,
// so the validation schema serves as the contract.
type IncomingMetric = Partial<z.input<typeof metricSchema>>;

/**
 * Validates a measurement and logs it to the console. Values that don't match
 * the schema are silently dropped.
 *
 * @param metric - The measurement passed from `useReportWebVitals`
 */
export function reportWebVital(metric: IncomingMetric): void {
  const result = metricSchema.safeParse(metric);

  if (!result.success) {
    return;
  }

  const { name, value, rating } = result.data;
  // Log Web Vitals measurements at info level
  // oxlint-disable-next-line no-console
  console.info(
    `%c [Web Vitals]: ${name}: ${value} / Rating: ${rating}`,
    style,
    metric
  );
}

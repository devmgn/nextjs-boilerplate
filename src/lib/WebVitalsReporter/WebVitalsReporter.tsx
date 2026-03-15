"use client";

import { useReportWebVitals } from "next/web-vitals";
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

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const result = metricSchema.safeParse(metric);
    if (!result.success) {
      return;
    }

    const { name, value, rating } = result.data;
    // oxlint-disable-next-line no-console
    console.info(
      `%c [Web Vitals]: ${name}: ${value} / Rating: ${rating}`,
      style,
      metric,
    );
  });

  return null;
}

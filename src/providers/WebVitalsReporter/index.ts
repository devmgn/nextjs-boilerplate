"use client";

import { useReportWebVitals } from "next/web-vitals";

const style = `
  font-size: 10px;
  padding-inline: 4px;
  border-radius: 8px;
  background-color: #3F51B5;
  color: #FFF;
`;

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // biome-ignore lint/suspicious/noConsole: logging
    console.info(
      `%c [Web Vitals]: ${metric.name}: ${metric.value} / Rating: ${metric.rating}`,
      style.toString(),
      metric,
    );
  });

  return null;
}

"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVital } from "./utils/report-web-vital";

// 副作用のみのコンポーネントで JSX を返さないため sonarjs が関数名とみなす
// oxlint-disable-next-line sonarjs/function-name
export function WebVitalsReporter() {
  useReportWebVitals(reportWebVital);

  return null;
}

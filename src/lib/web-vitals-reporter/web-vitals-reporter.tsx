"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVital } from "./utils/report-web-vital";

/**
 * Side-effect-only component that reports Web Vitals measurements.
 *
 * @returns Always `null`, since it renders nothing
 */
// sonarjs treats this as a function name because this side-effect-only component returns no JSX
// oxlint-disable-next-line sonarjs/function-name
export function WebVitalsReporter() {
  useReportWebVitals(reportWebVital);

  return null;
}

/**
 * Component that throws during render to demonstrate ErrorBoundary catching it.
 *
 * Callers need not write a throw themselves and can express the state in JSX as
 * `{shouldError && <ErrorThrower />}`.
 */
// It only throws (returns never) and never returns JSX, so sonarjs treats it as a function name
// oxlint-disable-next-line sonarjs/function-name
export function ErrorThrower(): never {
  throw new Error("This is a test error to demonstrate ErrorBoundary!");
}

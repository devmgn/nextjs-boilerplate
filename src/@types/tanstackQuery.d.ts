import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: { skipToast?: boolean };
    mutationMeta: { skipToast?: boolean };
  }
}

import { QueryClient, environmentManager } from "@tanstack/react-query";
import { QUERY_CLIENT_CONFIG } from "../../config/queryClientConfig";

function makeQueryClient() {
  return new QueryClient(QUERY_CLIENT_CONFIG);
}

// oxlint-disable-next-line init-declarations
let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

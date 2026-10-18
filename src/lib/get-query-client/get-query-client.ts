import { QueryClient, environmentManager } from "@tanstack/react-query";
import { createQueryClientConfig } from "./config/query-client-config";

function makeQueryClient() {
  return new QueryClient(createQueryClientConfig());
}

let browserQueryClient: QueryClient | undefined;

/**
 * Gets a QueryClient. Creates a new one on every call on the server, and reuses
 * a singleton in the browser.
 *
 * @returns A QueryClient instance
 */
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

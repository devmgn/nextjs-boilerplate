import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./openapi/realworld.yml",
    output: {
      target: "./src/api/openapi",
      schemas: "./src/api/openapi/model",
      mode: "tags-split",
      indexFiles: false,
      namingConvention: "kebab-case",
      client: "react-query",
      httpClient: "fetch",
      baseUrl: { getBaseUrlFromSpecification: true },
      clean: true,
      mock: {
        // Emit fixtures (per-endpoint mocks with a fixed seed + typed overrides). Requires indexMockFiles
        indexMockFiles: true,
        fixtures: true,
        generators: [
          { type: "msw", locale: "ja" },
          { type: "faker", locale: "ja" },
        ],
      },
      override: {
        mutator: {
          path: "./src/api/api-client/api-client.ts",
          name: "apiClient",
        },
        fetch: { includeHttpResponseReturnType: false },
        query: {
          version: 5,
          signal: true,
          useSuspenseQuery: true,
          useOperationIdAsQueryKey: true,
          shouldFilterQueryKey: true,
        },
      },
    },
  },
});

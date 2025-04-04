import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    globalSetup: path.resolve(__dirname, "./vitest.globalSetup.ts"),
    setupFiles: path.resolve(__dirname, "./vitest.setup.ts"),
    typecheck: { enabled: true },
    coverage: {
      include: ["src/**"],
      exclude: ["**/*.stories.*", "**/*.d.ts"],
    },
  },
});

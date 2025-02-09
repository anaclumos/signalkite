import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.spec.ts"],
    exclude: ["e2e/**"],
    setupFiles: ["./lib/setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})

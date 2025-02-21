import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.spec.{ts,tsx}"],
    exclude: ["node_modules/**"],
    setupFiles: ["./tests/vitest.setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})

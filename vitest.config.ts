import path from "path"
// Import required dependencies
import react from "@vitejs/plugin-react" // React plugin for Vite
import { defineConfig } from "vitest/config" // Vitest configuration helper

/**
 * Vitest Configuration
 * Configures the testing environment and settings
 */
export default defineConfig({
  // Configure Vite plugins
  plugins: [
    react(), // Enable React support in tests
  ],

  // Test configuration
  test: {
    // Enable global test functions (describe, it, expect)
    globals: true,

    // Use jsdom for browser API simulation
    environment: "jsdom",

    // Test file patterns
    include: ["**/*.spec.{ts,tsx}"], // Include spec files
    exclude: ["node_modules/**"], // Exclude node_modules

    // Test setup file for global configurations
    setupFiles: ["./tests/vitest.setup.ts"],

    // Path aliases for imports
    alias: {
      "@": path.resolve(__dirname, "./"), // Map @ to project root
    },
  },
})

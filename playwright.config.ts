import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
// Import required Node.js utilities
import { defineConfig, devices } from "@playwright/test"

// Server configuration
const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

// ES modules dirname setup
// Required because ES modules don't have __dirname global
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Playwright Configuration
 * Configures end-to-end testing environment and test projects
 */
export default defineConfig({
  // Global test timeout (30 seconds)
  timeout: 30 * 1000,

  // Directory containing test files
  testDir: path.join(__dirname, "e2e"),

  // Retry failed tests in CI
  retries: process.env.CI ? 2 : 0,

  // Directory for test artifacts (screenshots, videos, etc.)
  outputDir: "test-results/",

  // Development server configuration
  webServer: {
    command: "bun run ci", // Command to start the server
    url: baseURL, // Server URL to wait for
    timeout: 120 * 1000, // Server startup timeout (2 minutes)
    reuseExistingServer: !process.env.CI, // Reuse server in development
  },

  // Global test configuration
  use: {
    baseURL, // Base URL for navigation
    trace: "retry-with-trace", // Capture traces on retry
  },

  // Test projects with different configurations
  projects: [
    // Global setup project
    {
      name: "Setup",
      testMatch: /global\.setup\.ts/, // Setup file pattern
    },

    // Tests requiring authentication
    {
      name: "Authenticated State Tests",
      testMatch: /.*authenticated.spec.ts/, // Auth test pattern
      use: {
        ...devices["Desktop Chrome"], // Use Chrome
        storageState: "playwright/.clerk/user.json", // Auth state file
      },
      dependencies: ["Setup"], // Run setup first
    },

    // Tests for unauthenticated state
    {
      name: "Unauthorized State Tests",
      testMatch: /.*unauthorized.spec.ts/, // Unauth test pattern
      use: {
        ...devices["Desktop Chrome"], // Use Chrome
      },
    },
  ],
})

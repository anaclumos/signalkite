import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  timeout: 30 * 1000,
  testDir: path.join(__dirname, "e2e"),
  retries: process.env.CI ? 2 : 0,
  outputDir: "test-results/",

  webServer: {
    command: "bun run build && bun run start",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    trace: "retry-with-trace",
  },

  projects: [
    {
      name: "Setup",
      testMatch: /global\.setup\.ts/,
    },
    {
      name: "Authenticated State Tests",
      testMatch: /.*authenticated.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.clerk/user.json",
      },
      dependencies: ["Setup"],
    },
    {
      name: "Unauthorized State Tests",
      testMatch: /.*unauthorized.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
})

// Import Trigger.dev configuration helper
import { defineConfig } from "@trigger.dev/sdk/v3"

/**
 * Trigger.dev Configuration
 * Defines settings for background job processing and scheduling
 */
export default defineConfig({
  // Unique project identifier from Trigger.dev dashboard
  project: "proj_fphgwsohmgmutodjynqx",

  // Execution environment for jobs
  runtime: "node",

  // Logging verbosity level
  logLevel: "log",

  // Maximum allowed execution time for tasks (in seconds)
  // Tasks running longer than this will be terminated
  // Can be overridden per individual task
  // @see https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600, // 1 hour

  // Retry configuration for failed jobs
  retries: {
    // Enable retries in development environment
    enabledInDev: true,

    // Default retry strategy
    default: {
      maxAttempts: 3, // Maximum number of retry attempts
      minTimeoutInMs: 1000, // Initial retry delay (1 second)
      maxTimeoutInMs: 10000, // Maximum retry delay (10 seconds)
      factor: 2, // Exponential backoff factor
      randomize: true, // Add jitter to retry delays
    },
  },

  // Directory containing worker definitions
  // Workers handle background jobs and scheduled tasks
  dirs: ["workers"],
})

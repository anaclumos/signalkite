// Import required Trigger.dev utilities
import { logger, schedules, wait } from "@trigger.dev/sdk/v3"

/**
 * Example scheduled task definition
 * Demonstrates basic scheduling and task execution features
 */
export const firstScheduledTask = schedules.task({
  // Unique identifier for this task
  id: "first-scheduled-task",

  // Schedule using cron syntax
  // "0 * * * *" = Run at the start of every hour
  // Min | Hour | Day of Month | Month | Day of Week
  cron: "0 * * * *",

  // Task execution time limit
  // Prevents runaway tasks by stopping execution after specified duration
  maxDuration: 300, // 5 minutes in seconds

  /**
   * Task execution function
   * @param payload - Contains execution context like timestamps
   * @param ctx - Additional context and helper functions
   */
  run: async (payload, { ctx }) => {
    // Calculate time since last execution
    // For first run, lastTimestamp will be undefined
    const distanceInMs =
      payload.timestamp.getTime() -
      (payload.lastTimestamp ?? new Date()).getTime()

    // Log task start with timing information
    logger.log("First scheduled tasks", { payload, distanceInMs })

    // Simulate some work with a delay
    // Useful for testing and demonstration
    await wait.for({ seconds: 5 })

    // Format execution timestamp in user's timezone
    // This ensures consistent time display across different server locations
    const formatted = payload.timestamp.toLocaleString("en-US", {
      timeZone: payload.timezone,
    })

    // Log formatted timestamp
    logger.log(formatted)
  },
})

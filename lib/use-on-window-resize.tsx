// Tremor Raw useOnWindowResize [v0.0.0]

"use client"

import * as React from "react"

/**
 * React hook to handle window resize events
 *
 * Features:
 * - Executes handler immediately on mount
 * - Automatically manages event listener cleanup
 * - Memoizes the event handler to prevent unnecessary re-renders
 *
 * @param handler - Callback function to execute on window resize
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useOnWindowResize(() => {
 *     // Handle window resize
 *     console.log('Window resized:', window.innerWidth, window.innerHeight);
 *   });
 *
 *   return <div>Responsive Component</div>;
 * }
 * ```
 */
export const useOnWindowResize = (handler: { (): void }) => {
  React.useEffect(() => {
    // Create resize event handler
    const handleResize = () => {
      handler()
    }

    // Execute handler immediately on mount
    handleResize()

    // Add window resize listener
    window.addEventListener("resize", handleResize)

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize)
  }, [handler]) // Re-run effect if handler changes
}

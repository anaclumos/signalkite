"use client"

import * as React from "react"

// Mobile breakpoint in pixels for responsive design
const MOBILE_BREAKPOINT = 768

/**
 * React hook to detect if the current viewport is mobile-sized
 *
 * Features:
 * - Uses CSS media queries for efficient viewport detection
 * - Updates automatically on window resize
 * - Handles cleanup on unmount
 * - Returns boolean indicating if viewport width is below mobile breakpoint
 *
 * @returns {boolean} True if viewport width is less than MOBILE_BREAKPOINT
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   return (
 *     <div>
 *       {isMobile ? <MobileView /> : <DesktopView />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIsMobile() {
  // State to track mobile status, initially undefined for SSR compatibility
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query list for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Handler to update mobile status
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add listener for viewport changes
    mql.addEventListener("change", onChange)

    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Convert undefined to false for consistent boolean return
  return !!isMobile
}

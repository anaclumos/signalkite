"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * React hook to detect when page scroll exceeds a threshold
 *
 * Features:
 * - Tracks window scroll position
 * - Compares against provided threshold
 * - Updates state when threshold is crossed
 * - Handles cleanup on unmount
 * - Memoizes scroll handler for performance
 *
 * @param threshold - Number of pixels to scroll before triggering state change
 * @returns {boolean} True if scroll position exceeds threshold
 *
 * @example
 * ```tsx
 * function Navbar() {
 *   const isScrolled = useScroll(50);
 *   return (
 *     <nav className={isScrolled ? "nav-scrolled" : "nav-top"}>
 *       // Navbar content
 *     </nav>
 *   );
 * }
 * ```
 */
export default function useScroll(threshold: number) {
  // State to track if scroll position exceeds threshold
  const [scrolled, setScrolled] = useState(false)

  // Memoized scroll handler to prevent unnecessary re-renders
  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold)
  }, [threshold])

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", onScroll)

    // Check initial scroll position
    onScroll()

    // Cleanup listener on unmount
    return () => window.removeEventListener("scroll", onScroll)
  }, [onScroll])

  return scrolled
}

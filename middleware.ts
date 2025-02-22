// Import Clerk authentication middleware
import { clerkMiddleware } from "@clerk/nextjs/server"

// Apply Clerk middleware to protect routes
export default clerkMiddleware()

/**
 * Middleware configuration for route protection
 *
 * The matcher array defines which routes should be processed by the middleware:
 * 1. Static file exclusions - Skip Next.js internal routes and static files
 * 2. API routes - Always apply middleware to API endpoints
 * 3. Protected application routes - Require authentication
 */
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    // Matches all routes EXCEPT:
    // - Next.js internal routes (_next/*)
    // - Static files with common extensions (html, css, js, images, fonts, etc.)
    // Unless they are found in search parameters
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always process API routes
    // Includes both standard API routes and tRPC endpoints
    "/(api|trpc)(.*)",

    // Protected application routes
    // These routes require authentication:
    "/notification-channels(.*)", // Notification channel management
    "/prompts(.*)", // AI prompt management
    "/schedules(.*)", // Schedule management
    "/dashboard(.*)", // User dashboard
    "/reporters(.*)", // Reporter management
    "/archives(.*)", // Archived content
  ],
}

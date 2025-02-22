// Import Next.js configuration type
import { NextConfig } from "next"

/**
 * Next.js configuration object
 * Defines experimental features and optimizations:
 */
const nextConfig: NextConfig = {
  experimental: {
    // Enable React compiler for improved performance
    reactCompiler: true,

    // Enable authentication interrupts for better auth flow handling
    authInterrupts: true,

    // Optimize imports from specific packages to reduce bundle size
    // Here we optimize RemixIcon React components
    optimizePackageImports: ["@remixicon/react"],
  },
}

export default nextConfig

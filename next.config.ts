import { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    authInterrupts: true,
    optimizePackageImports: ["@remixicon/react"],
  },
}

export default nextConfig

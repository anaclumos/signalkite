import { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
    reactCompiler: true,
    authInterrupts: true,
    useCache: true,
    optimizePackageImports: ["@remixicon/react"],
  },
}

export default nextConfig

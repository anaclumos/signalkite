import { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
    reactCompiler: true,
    authInterrupts: true,
  },
}

export default nextConfig

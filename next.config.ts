import { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
    reactCompiler: true,
  },
}

export default nextConfig

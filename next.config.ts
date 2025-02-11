import { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
    reactCompiler: true,
    authInterrupts: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add a custom cache group for remixicon
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          remixicon: {
            test: /[\\/]node_modules[\\/](@remixicon\/react)[\\/]/,
            name: "remixicon-chunk",
            chunks: "all",
            enforce: true,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig

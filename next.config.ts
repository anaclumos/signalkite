import { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
    reactCompiler: true,
    authInterrupts: true,
    useCache: true,
    optimizePackageImports: ["@remixicon/react"],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: "async",
      minSize: 10000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 50,
      maxInitialRequests: 50,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name(module: any) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1]
            return `npm.${packageName.replace("@", "")}`
          },
        },
        remixicon: {
          test: /[\\/]node_modules[\\/]@remixicon[\\/]/,
          name: "remixicon",
          chunks: "all",
          priority: 20,
          reuseExistingChunk: true,
        },
      },
    }
    return config
  },
}

export default nextConfig

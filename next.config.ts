/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/quotes/overview",
        permanent: true,
      },
    ]
  },
}

export default nextConfig

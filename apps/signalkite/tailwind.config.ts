import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Pretendard Variable, sans-serif",
        { fontFeatureSettings: '"cv11"' },
      ],
    },
  },
  plugins: [],
} satisfies Config

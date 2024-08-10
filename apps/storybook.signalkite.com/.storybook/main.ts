import { dirname, join } from "node:path"
import type { StorybookConfig } from "@storybook/react-vite"

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")))
}
const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
}
export default config

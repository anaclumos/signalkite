import type { ComponentMeta } from "@storybook/react";

import FallbackPage from "./FallbackPage";

export const generated = () => {
  return <FallbackPage />;
};

export default {
  title: "Pages/FallbackPage",
  component: FallbackPage,
} as ComponentMeta<typeof FallbackPage>;

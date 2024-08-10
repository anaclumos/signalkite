import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "@signalkite/design/components/ui/label"

const meta: Meta<typeof Label> = {
  title: "Shadcn/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
    htmlFor: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Default Label",
  },
}

export const WithHtmlFor: Story = {
  args: {
    children: "Email",
    htmlFor: "email-input",
  },
}

export const LongText: Story = {
  args: {
    children: "This is a label with a longer text to see how it wraps",
  },
}

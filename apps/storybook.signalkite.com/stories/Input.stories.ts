import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "@signalkite/design/components/ui/input"

const meta: Meta<typeof Input> = {
  title: "Shadcn/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
}

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter email...",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
}

export const WithValue: Story = {
  args: {
    value: "Hello, World!",
    readOnly: true,
  },
}

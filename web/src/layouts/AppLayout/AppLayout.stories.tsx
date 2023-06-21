import type { ComponentMeta, ComponentStory } from '@storybook/react'

import AppLayout from './AppLayout'

export const generated: ComponentStory<typeof AppLayout> = (args) => {
  return <AppLayout {...args} />
}

export default {
  title: 'Layouts/AppLayout',
  component: AppLayout,
} as ComponentMeta<typeof AppLayout>

import type { ComponentMeta } from '@storybook/react'

import SettingsPage from './SettingsPage'

export const generated = () => {
  return <SettingsPage />
}

export default {
  title: 'Pages/SettingsPage',
  component: SettingsPage,
} as ComponentMeta<typeof SettingsPage>

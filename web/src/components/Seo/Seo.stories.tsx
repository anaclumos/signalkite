// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Seo> = (args) => {
//   return <Seo {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Seo from './Seo'

export const generated = () => {
  return <Seo />
}

export default {
  title: 'Components/Seo',
  component: Seo,
} as ComponentMeta<typeof Seo>

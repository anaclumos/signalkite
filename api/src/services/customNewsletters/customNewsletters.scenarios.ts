import type { Prisma, CustomNewsletter } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CustomNewsletterCreateArgs>({
  customNewsletter: {
    one: {
      data: {
        publicNewsletterHandle: 'String',
        keyword: 'String',
        targetRegion: 'String',
        updatedAt: '2023-06-27T01:36:54.451Z',
        User: {
          create: {
            username: 'String',
            password: 'String',
            email: 'String8229637',
            timezone: 'String',
            updatedAt: '2023-06-27T01:36:54.451Z',
          },
        },
      },
    },
    two: {
      data: {
        publicNewsletterHandle: 'String',
        keyword: 'String',
        targetRegion: 'String',
        updatedAt: '2023-06-27T01:36:54.451Z',
        User: {
          create: {
            username: 'String',
            password: 'String',
            email: 'String926879',
            timezone: 'String',
            updatedAt: '2023-06-27T01:36:54.451Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  CustomNewsletter,
  'customNewsletter'
>

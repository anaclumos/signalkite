import type { Prisma, CuratedNewsletter } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CuratedNewsletterCreateArgs>({
  curatedNewsletter: {
    one: {
      data: {
        publicNewsletterHandle: 'String',
        newsletterName: 'String',
        updatedAt: '2023-06-27T01:36:43.445Z',
        User: {
          create: {
            username: 'String',
            password: 'String',
            email: 'String7870735',
            timezone: 'String',
            updatedAt: '2023-06-27T01:36:43.445Z',
          },
        },
      },
    },
    two: {
      data: {
        publicNewsletterHandle: 'String',
        newsletterName: 'String',
        updatedAt: '2023-06-27T01:36:43.445Z',
        User: {
          create: {
            username: 'String',
            password: 'String',
            email: 'String5456462',
            timezone: 'String',
            updatedAt: '2023-06-27T01:36:43.445Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  CuratedNewsletter,
  'curatedNewsletter'
>

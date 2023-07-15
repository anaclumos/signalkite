import type { Prisma, Newsletter } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsletterCreateArgs>({
  newsletter: {
    one: {
      data: {
        handle: 'String6348605',
        name: 'String',
        keyword: 'String',
        locale: 'String',
        region: 'String',
        userId: 'String',
        updatedAt: '2023-07-12T05:03:49.372Z',
      },
    },
    two: {
      data: {
        handle: 'String9573518',
        name: 'String',
        keyword: 'String',
        locale: 'String',
        region: 'String',
        userId: 'String',
        updatedAt: '2023-07-12T05:03:49.372Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Newsletter, 'newsletter'>

import type { Prisma, Newsletter } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsletterCreateArgs>({
  newsletter: {
    one: {
      data: {
        handle: 'String2599065',
        name: 'String',
        keyword: 'String',
        region: 'String',
        userId: 'String',
        updatedAt: '2023-07-12T04:40:35.117Z',
      },
    },
    two: {
      data: {
        handle: 'String6983430',
        name: 'String',
        keyword: 'String',
        region: 'String',
        userId: 'String',
        updatedAt: '2023-07-12T04:40:35.117Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Newsletter, 'newsletter'>

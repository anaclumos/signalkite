import type { Prisma, LinkSummary } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LinkSummaryCreateArgs>({
  linkSummary: {
    one: {
      data: {
        linkUrl: 'String',
        title: 'String',
        linkSummary: 'String',
        BCP47: 'String',
        updatedAt: '2023-06-27T01:37:06.656Z',
      },
    },
    two: {
      data: {
        linkUrl: 'String',
        title: 'String',
        linkSummary: 'String',
        BCP47: 'String',
        updatedAt: '2023-06-27T01:37:06.656Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<LinkSummary, 'linkSummary'>

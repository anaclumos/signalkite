import type { Prisma, Summary } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SummaryCreateArgs>({
  summary: {
    one: {
      data: {
        title: 'String',
        originLink: 'String',
        updatedAt: '2023-07-12T05:15:37.331Z',
      },
    },
    two: {
      data: {
        title: 'String',
        originLink: 'String',
        updatedAt: '2023-07-12T05:15:37.331Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Summary, 'summary'>

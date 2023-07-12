import type { Prisma, Summary } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SummaryCreateArgs>({
  summary: {
    one: {
      data: {
        title: 'String',
        origin: 'String',
        updatedAt: '2023-07-12T04:40:39.509Z',
      },
    },
    two: {
      data: {
        title: 'String',
        origin: 'String',
        updatedAt: '2023-07-12T04:40:39.509Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Summary, 'summary'>

import type { Prisma, Content } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContentCreateArgs>({
  content: {
    one: { data: { BCP47: 'String', updatedAt: '2023-07-10T22:12:21.046Z' } },
    two: { data: { BCP47: 'String', updatedAt: '2023-07-10T22:12:21.046Z' } },
  },
})

export type StandardScenario = ScenarioData<Content, 'content'>

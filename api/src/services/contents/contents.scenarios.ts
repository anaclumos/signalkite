import type { Prisma, Content } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContentCreateArgs>({
  content: {
    one: { data: { BCP47: 'String', updatedAt: '2023-06-27T01:36:07.703Z' } },
    two: { data: { BCP47: 'String', updatedAt: '2023-06-27T01:36:07.703Z' } },
  },
})

export type StandardScenario = ScenarioData<Content, 'content'>

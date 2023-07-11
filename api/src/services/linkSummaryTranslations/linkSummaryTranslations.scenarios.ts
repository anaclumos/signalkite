import type { Prisma, LinkSummaryTranslation } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LinkSummaryTranslationCreateArgs>(
  {
    linkSummaryTranslation: {
      one: {
        data: {
          title: 'String',
          linkSummaryId: 3393617,
          linkSummary: 'String',
          BCP47: 'String',
          updatedAt: '2023-07-10T22:12:30.412Z',
        },
      },
      two: {
        data: {
          title: 'String',
          linkSummaryId: 1232652,
          linkSummary: 'String',
          BCP47: 'String',
          updatedAt: '2023-07-10T22:12:30.412Z',
        },
      },
    },
  }
)

export type StandardScenario = ScenarioData<
  LinkSummaryTranslation,
  'linkSummaryTranslation'
>

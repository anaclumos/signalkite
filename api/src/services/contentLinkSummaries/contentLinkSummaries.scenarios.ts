import type { Prisma, ContentLinkSummary } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContentLinkSummaryCreateArgs>({
  contentLinkSummary: {
    one: {
      data: {
        contentId: 1587029,
        linkSummaryId: 220005,
        order: 6522003,
        updatedAt: '2023-07-10T22:12:23.431Z',
      },
    },
    two: {
      data: {
        contentId: 8484155,
        linkSummaryId: 1960872,
        order: 64724,
        updatedAt: '2023-07-10T22:12:23.431Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  ContentLinkSummary,
  'contentLinkSummary'
>

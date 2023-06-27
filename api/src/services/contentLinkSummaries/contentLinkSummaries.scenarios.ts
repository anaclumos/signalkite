import type { Prisma, ContentLinkSummary } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContentLinkSummaryCreateArgs>({
  contentLinkSummary: {
    one: {
      data: {
        order: 9804872,
        updatedAt: '2023-06-27T01:36:26.762Z',
        Content: {
          create: { BCP47: 'String', updatedAt: '2023-06-27T01:36:26.762Z' },
        },
        LinkSummary: {
          create: {
            linkUrl: 'String',
            title: 'String',
            linkSummary: 'String',
            BCP47: 'String',
            updatedAt: '2023-06-27T01:36:26.762Z',
          },
        },
      },
    },
    two: {
      data: {
        order: 7522985,
        updatedAt: '2023-06-27T01:36:26.762Z',
        Content: {
          create: { BCP47: 'String', updatedAt: '2023-06-27T01:36:26.762Z' },
        },
        LinkSummary: {
          create: {
            linkUrl: 'String',
            title: 'String',
            linkSummary: 'String',
            BCP47: 'String',
            updatedAt: '2023-06-27T01:36:26.762Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  ContentLinkSummary,
  'contentLinkSummary'
>

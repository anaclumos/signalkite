import type { Prisma, NewsletterContent } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsletterContentCreateArgs>({
  newsletterContent: {
    one: {
      data: {
        newsletterId: 'String',
        summaryLink: 'String',
        updatedAt: '2023-07-12T05:03:47.179Z',
      },
    },
    two: {
      data: {
        newsletterId: 'String',
        summaryLink: 'String',
        updatedAt: '2023-07-12T05:03:47.179Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  NewsletterContent,
  'newsletterContent'
>

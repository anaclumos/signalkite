import type { Prisma, NewsletterContent } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsletterContentCreateArgs>({
  newsletterContent: {
    one: {
      data: {
        newsletterId: 'String',
        summaryId: 'String',
        updatedAt: '2023-07-12T04:40:32.924Z',
      },
    },
    two: {
      data: {
        newsletterId: 'String',
        summaryId: 'String',
        updatedAt: '2023-07-12T04:40:32.924Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  NewsletterContent,
  'newsletterContent'
>

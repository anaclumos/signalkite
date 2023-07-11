import type { Prisma, Newsletter } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsletterCreateArgs>({
  newsletter: {
    one: {
      data: {
        publicNewsletterHandle: 'String3224425',
        newsletterName: 'String',
        keyword: 'String',
        targetRegion: 'String',
        userId: 9964047,
        updatedAt: '2023-07-10T22:12:16.333Z',
      },
    },
    two: {
      data: {
        publicNewsletterHandle: 'String1698450',
        newsletterName: 'String',
        keyword: 'String',
        targetRegion: 'String',
        userId: 9132215,
        updatedAt: '2023-07-10T22:12:16.333Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Newsletter, 'newsletter'>

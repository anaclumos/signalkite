import type { Prisma, Subscription } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubscriptionCreateArgs>({
  subscription: {
    one: {
      data: {
        userId: 'String',
        newsletterId: 'String',
        frequency: 'String',
        time: 'String',
        length: 'String',
        updatedAt: '2023-07-12T05:03:51.526Z',
      },
    },
    two: {
      data: {
        userId: 'String',
        newsletterId: 'String',
        frequency: 'String',
        time: 'String',
        length: 'String',
        updatedAt: '2023-07-12T05:03:51.526Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subscription, 'subscription'>

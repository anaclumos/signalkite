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
        locale: 'String',
        updatedAt: '2023-07-12T04:40:37.311Z',
      },
    },
    two: {
      data: {
        userId: 'String',
        newsletterId: 'String',
        frequency: 'String',
        time: 'String',
        length: 'String',
        locale: 'String',
        updatedAt: '2023-07-12T04:40:37.311Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subscription, 'subscription'>

import type { Prisma, Subscription } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubscriptionCreateArgs>({
  subscription: {
    one: {
      data: {
        frequency: 'String',
        time: 'String',
        length: 'String',
        BCP47: 'String',
        updatedAt: '2023-06-27T01:37:23.153Z',
        User: {
          create: {
            username: 'String',
            password: 'String',
            email: 'String863828',
            timezone: 'String',
            updatedAt: '2023-06-27T01:37:23.153Z',
          },
        },
      },
    },
    two: {
      data: {
        frequency: 'String',
        time: 'String',
        length: 'String',
        BCP47: 'String',
        updatedAt: '2023-06-27T01:37:23.153Z',
        User: {
          create: {
            username: 'String',
            password: 'String',
            email: 'String5406040',
            timezone: 'String',
            updatedAt: '2023-06-27T01:37:23.153Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subscription, 'subscription'>

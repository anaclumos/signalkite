import type { Prisma, Outbox } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OutboxCreateArgs>({
  outbox: {
    one: {
      data: {
        status: 'String',
        updatedAt: '2023-06-27T01:37:16.630Z',
        Content: {
          create: { BCP47: 'String', updatedAt: '2023-06-27T01:37:16.630Z' },
        },
        Subscription: {
          create: {
            frequency: 'String',
            time: 'String',
            length: 'String',
            BCP47: 'String',
            updatedAt: '2023-06-27T01:37:16.630Z',
            User: {
              create: {
                username: 'String',
                password: 'String',
                email: 'String4246958',
                timezone: 'String',
                updatedAt: '2023-06-27T01:37:16.630Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        status: 'String',
        updatedAt: '2023-06-27T01:37:16.630Z',
        Content: {
          create: { BCP47: 'String', updatedAt: '2023-06-27T01:37:16.630Z' },
        },
        Subscription: {
          create: {
            frequency: 'String',
            time: 'String',
            length: 'String',
            BCP47: 'String',
            updatedAt: '2023-06-27T01:37:16.630Z',
            User: {
              create: {
                username: 'String',
                password: 'String',
                email: 'String1727209',
                timezone: 'String',
                updatedAt: '2023-06-27T01:37:16.630Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Outbox, 'outbox'>

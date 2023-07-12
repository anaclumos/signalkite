import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        timezone: 'String',
        handle: 'String3292758',
        email: 'String5272915',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2023-07-12T04:40:30.739Z',
      },
    },
    two: {
      data: {
        timezone: 'String',
        handle: 'String6739506',
        email: 'String6897123',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2023-07-12T04:40:30.739Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>

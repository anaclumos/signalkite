import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        username: 'String',
        password: 'String',
        email: 'String4740061',
        timezone: 'String',
        updatedAt: '2023-06-27T01:37:32.357Z',
      },
    },
    two: {
      data: {
        username: 'String',
        password: 'String',
        email: 'String4329730',
        timezone: 'String',
        updatedAt: '2023-06-27T01:37:32.357Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>

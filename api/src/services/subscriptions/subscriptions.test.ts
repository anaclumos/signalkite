import type { Subscription } from '@prisma/client'

import {
  subscriptions,
  subscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from './subscriptions'
import type { StandardScenario } from './subscriptions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('subscriptions', () => {
  scenario('returns all subscriptions', async (scenario: StandardScenario) => {
    const result = await subscriptions()

    expect(result.length).toEqual(Object.keys(scenario.subscription).length)
  })

  scenario(
    'returns a single subscription',
    async (scenario: StandardScenario) => {
      const result = await subscription({ id: scenario.subscription.one.id })

      expect(result).toEqual(scenario.subscription.one)
    }
  )

  scenario('creates a subscription', async (scenario: StandardScenario) => {
    const result = await createSubscription({
      input: {
        userId: scenario.subscription.two.userId,
        frequency: 'String',
        time: 'String',
        length: 'String',
        BCP47: 'String',
        updatedAt: '2023-06-27T01:37:23.141Z',
      },
    })

    expect(result.userId).toEqual(scenario.subscription.two.userId)
    expect(result.frequency).toEqual('String')
    expect(result.time).toEqual('String')
    expect(result.length).toEqual('String')
    expect(result.BCP47).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-06-27T01:37:23.141Z'))
  })

  scenario('updates a subscription', async (scenario: StandardScenario) => {
    const original = (await subscription({
      id: scenario.subscription.one.id,
    })) as Subscription
    const result = await updateSubscription({
      id: original.id,
      input: { frequency: 'String2' },
    })

    expect(result.frequency).toEqual('String2')
  })

  scenario('deletes a subscription', async (scenario: StandardScenario) => {
    const original = (await deleteSubscription({
      id: scenario.subscription.one.id,
    })) as Subscription
    const result = await subscription({ id: original.id })

    expect(result).toEqual(null)
  })
})

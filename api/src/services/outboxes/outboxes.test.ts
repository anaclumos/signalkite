import type { Outbox } from '@prisma/client'

import {
  outboxes,
  outbox,
  createOutbox,
  updateOutbox,
  deleteOutbox,
} from './outboxes'
import type { StandardScenario } from './outboxes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('outboxes', () => {
  scenario('returns all outboxes', async (scenario: StandardScenario) => {
    const result = await outboxes()

    expect(result.length).toEqual(Object.keys(scenario.outbox).length)
  })

  scenario('returns a single outbox', async (scenario: StandardScenario) => {
    const result = await outbox({ id: scenario.outbox.one.id })

    expect(result).toEqual(scenario.outbox.one)
  })

  scenario('creates a outbox', async () => {
    const result = await createOutbox({
      input: {
        contentId: 8142137,
        subscriptionId: 3972713,
        status: 'String',
        updatedAt: '2023-07-10T22:12:25.775Z',
      },
    })

    expect(result.contentId).toEqual(8142137)
    expect(result.subscriptionId).toEqual(3972713)
    expect(result.status).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-07-10T22:12:25.775Z'))
  })

  scenario('updates a outbox', async (scenario: StandardScenario) => {
    const original = (await outbox({ id: scenario.outbox.one.id })) as Outbox
    const result = await updateOutbox({
      id: original.id,
      input: { contentId: 8523463 },
    })

    expect(result.contentId).toEqual(8523463)
  })

  scenario('deletes a outbox', async (scenario: StandardScenario) => {
    const original = (await deleteOutbox({
      id: scenario.outbox.one.id,
    })) as Outbox
    const result = await outbox({ id: original.id })

    expect(result).toEqual(null)
  })
})

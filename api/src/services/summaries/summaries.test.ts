import type { Summary } from '@prisma/client'

import {
  summaries,
  summary,
  createSummary,
  updateSummary,
  deleteSummary,
} from './summaries'
import type { StandardScenario } from './summaries.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('summaries', () => {
  scenario('returns all summaries', async (scenario: StandardScenario) => {
    const result = await summaries()

    expect(result.length).toEqual(Object.keys(scenario.summary).length)
  })

  scenario('returns a single summary', async (scenario: StandardScenario) => {
    const result = await summary({ id: scenario.summary.one.id })

    expect(result).toEqual(scenario.summary.one)
  })

  scenario('creates a summary', async () => {
    const result = await createSummary({
      input: {
        title: 'String',
        origin: 'String',
        updatedAt: '2023-07-12T05:03:53.698Z',
      },
    })

    expect(result.title).toEqual('String')
    expect(result.origin).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-07-12T05:03:53.698Z'))
  })

  scenario('updates a summary', async (scenario: StandardScenario) => {
    const original = (await summary({
      id: scenario.summary.one.id,
    })) as Summary
    const result = await updateSummary({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a summary', async (scenario: StandardScenario) => {
    const original = (await deleteSummary({
      id: scenario.summary.one.id,
    })) as Summary
    const result = await summary({ id: original.id })

    expect(result).toEqual(null)
  })
})

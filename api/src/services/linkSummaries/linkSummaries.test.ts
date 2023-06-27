import type { LinkSummary } from '@prisma/client'

import {
  linkSummaries,
  linkSummary,
  createLinkSummary,
  updateLinkSummary,
  deleteLinkSummary,
} from './linkSummaries'
import type { StandardScenario } from './linkSummaries.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('linkSummaries', () => {
  scenario('returns all linkSummaries', async (scenario: StandardScenario) => {
    const result = await linkSummaries()

    expect(result.length).toEqual(Object.keys(scenario.linkSummary).length)
  })

  scenario(
    'returns a single linkSummary',
    async (scenario: StandardScenario) => {
      const result = await linkSummary({ id: scenario.linkSummary.one.id })

      expect(result).toEqual(scenario.linkSummary.one)
    }
  )

  scenario('creates a linkSummary', async () => {
    const result = await createLinkSummary({
      input: {
        linkUrl: 'String',
        title: 'String',
        linkSummary: 'String',
        BCP47: 'String',
        updatedAt: '2023-06-27T01:37:06.644Z',
      },
    })

    expect(result.linkUrl).toEqual('String')
    expect(result.title).toEqual('String')
    expect(result.linkSummary).toEqual('String')
    expect(result.BCP47).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-06-27T01:37:06.644Z'))
  })

  scenario('updates a linkSummary', async (scenario: StandardScenario) => {
    const original = (await linkSummary({
      id: scenario.linkSummary.one.id,
    })) as LinkSummary
    const result = await updateLinkSummary({
      id: original.id,
      input: { linkUrl: 'String2' },
    })

    expect(result.linkUrl).toEqual('String2')
  })

  scenario('deletes a linkSummary', async (scenario: StandardScenario) => {
    const original = (await deleteLinkSummary({
      id: scenario.linkSummary.one.id,
    })) as LinkSummary
    const result = await linkSummary({ id: original.id })

    expect(result).toEqual(null)
  })
})

import type { ContentLinkSummary } from '@prisma/client'

import {
  contentLinkSummaries,
  contentLinkSummary,
  createContentLinkSummary,
  updateContentLinkSummary,
  deleteContentLinkSummary,
} from './contentLinkSummaries'
import type { StandardScenario } from './contentLinkSummaries.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('contentLinkSummaries', () => {
  scenario(
    'returns all contentLinkSummaries',
    async (scenario: StandardScenario) => {
      const result = await contentLinkSummaries()

      expect(result.length).toEqual(
        Object.keys(scenario.contentLinkSummary).length
      )
    }
  )

  scenario(
    'returns a single contentLinkSummary',
    async (scenario: StandardScenario) => {
      const result = await contentLinkSummary({
        id: scenario.contentLinkSummary.one.id,
      })

      expect(result).toEqual(scenario.contentLinkSummary.one)
    }
  )

  scenario('creates a contentLinkSummary', async () => {
    const result = await createContentLinkSummary({
      input: {
        contentId: 8345125,
        linkSummaryId: 5298831,
        order: 4628870,
        updatedAt: '2023-07-10T22:12:23.418Z',
      },
    })

    expect(result.contentId).toEqual(8345125)
    expect(result.linkSummaryId).toEqual(5298831)
    expect(result.order).toEqual(4628870)
    expect(result.updatedAt).toEqual(new Date('2023-07-10T22:12:23.418Z'))
  })

  scenario(
    'updates a contentLinkSummary',
    async (scenario: StandardScenario) => {
      const original = (await contentLinkSummary({
        id: scenario.contentLinkSummary.one.id,
      })) as ContentLinkSummary
      const result = await updateContentLinkSummary({
        id: original.id,
        input: { contentId: 50682 },
      })

      expect(result.contentId).toEqual(50682)
    }
  )

  scenario(
    'deletes a contentLinkSummary',
    async (scenario: StandardScenario) => {
      const original = (await deleteContentLinkSummary({
        id: scenario.contentLinkSummary.one.id,
      })) as ContentLinkSummary
      const result = await contentLinkSummary({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})

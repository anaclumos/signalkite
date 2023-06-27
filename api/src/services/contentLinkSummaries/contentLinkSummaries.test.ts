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

  scenario(
    'creates a contentLinkSummary',
    async (scenario: StandardScenario) => {
      const result = await createContentLinkSummary({
        input: {
          contentId: scenario.contentLinkSummary.two.contentId,
          linkSummaryId: scenario.contentLinkSummary.two.linkSummaryId,
          order: 9333962,
          updatedAt: '2023-06-27T01:36:26.744Z',
        },
      })

      expect(result.contentId).toEqual(
        scenario.contentLinkSummary.two.contentId
      )
      expect(result.linkSummaryId).toEqual(
        scenario.contentLinkSummary.two.linkSummaryId
      )
      expect(result.order).toEqual(9333962)
      expect(result.updatedAt).toEqual(new Date('2023-06-27T01:36:26.744Z'))
    }
  )

  scenario(
    'updates a contentLinkSummary',
    async (scenario: StandardScenario) => {
      const original = (await contentLinkSummary({
        id: scenario.contentLinkSummary.one.id,
      })) as ContentLinkSummary
      const result = await updateContentLinkSummary({
        id: original.id,
        input: { order: 2628670 },
      })

      expect(result.order).toEqual(2628670)
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

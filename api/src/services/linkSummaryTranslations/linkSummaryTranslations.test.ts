import type { LinkSummaryTranslation } from '@prisma/client'

import {
  linkSummaryTranslations,
  linkSummaryTranslation,
  createLinkSummaryTranslation,
  updateLinkSummaryTranslation,
  deleteLinkSummaryTranslation,
} from './linkSummaryTranslations'
import type { StandardScenario } from './linkSummaryTranslations.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('linkSummaryTranslations', () => {
  scenario(
    'returns all linkSummaryTranslations',
    async (scenario: StandardScenario) => {
      const result = await linkSummaryTranslations()

      expect(result.length).toEqual(
        Object.keys(scenario.linkSummaryTranslation).length
      )
    }
  )

  scenario(
    'returns a single linkSummaryTranslation',
    async (scenario: StandardScenario) => {
      const result = await linkSummaryTranslation({
        id: scenario.linkSummaryTranslation.one.id,
      })

      expect(result).toEqual(scenario.linkSummaryTranslation.one)
    }
  )

  scenario('creates a linkSummaryTranslation', async () => {
    const result = await createLinkSummaryTranslation({
      input: {
        title: 'String',
        linkSummaryId: 4429690,
        linkSummary: 'String',
        BCP47: 'String',
        updatedAt: '2023-07-10T22:12:30.394Z',
      },
    })

    expect(result.title).toEqual('String')
    expect(result.linkSummaryId).toEqual(4429690)
    expect(result.linkSummary).toEqual('String')
    expect(result.BCP47).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-07-10T22:12:30.394Z'))
  })

  scenario(
    'updates a linkSummaryTranslation',
    async (scenario: StandardScenario) => {
      const original = (await linkSummaryTranslation({
        id: scenario.linkSummaryTranslation.one.id,
      })) as LinkSummaryTranslation
      const result = await updateLinkSummaryTranslation({
        id: original.id,
        input: { title: 'String2' },
      })

      expect(result.title).toEqual('String2')
    }
  )

  scenario(
    'deletes a linkSummaryTranslation',
    async (scenario: StandardScenario) => {
      const original = (await deleteLinkSummaryTranslation({
        id: scenario.linkSummaryTranslation.one.id,
      })) as LinkSummaryTranslation
      const result = await linkSummaryTranslation({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})

import type { CustomNewsletter } from '@prisma/client'

import {
  customNewsletters,
  customNewsletter,
  createCustomNewsletter,
  updateCustomNewsletter,
  deleteCustomNewsletter,
} from './customNewsletters'
import type { StandardScenario } from './customNewsletters.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('customNewsletters', () => {
  scenario(
    'returns all customNewsletters',
    async (scenario: StandardScenario) => {
      const result = await customNewsletters()

      expect(result.length).toEqual(
        Object.keys(scenario.customNewsletter).length
      )
    }
  )

  scenario(
    'returns a single customNewsletter',
    async (scenario: StandardScenario) => {
      const result = await customNewsletter({
        id: scenario.customNewsletter.one.id,
      })

      expect(result).toEqual(scenario.customNewsletter.one)
    }
  )

  scenario('creates a customNewsletter', async (scenario: StandardScenario) => {
    const result = await createCustomNewsletter({
      input: {
        publicNewsletterHandle: 'String',
        keyword: 'String',
        targetRegion: 'String',
        userId: scenario.customNewsletter.two.userId,
        updatedAt: '2023-06-27T01:36:54.438Z',
      },
    })

    expect(result.publicNewsletterHandle).toEqual('String')
    expect(result.keyword).toEqual('String')
    expect(result.targetRegion).toEqual('String')
    expect(result.userId).toEqual(scenario.customNewsletter.two.userId)
    expect(result.updatedAt).toEqual(new Date('2023-06-27T01:36:54.438Z'))
  })

  scenario('updates a customNewsletter', async (scenario: StandardScenario) => {
    const original = (await customNewsletter({
      id: scenario.customNewsletter.one.id,
    })) as CustomNewsletter
    const result = await updateCustomNewsletter({
      id: original.id,
      input: { publicNewsletterHandle: 'String2' },
    })

    expect(result.publicNewsletterHandle).toEqual('String2')
  })

  scenario('deletes a customNewsletter', async (scenario: StandardScenario) => {
    const original = (await deleteCustomNewsletter({
      id: scenario.customNewsletter.one.id,
    })) as CustomNewsletter
    const result = await customNewsletter({ id: original.id })

    expect(result).toEqual(null)
  })
})

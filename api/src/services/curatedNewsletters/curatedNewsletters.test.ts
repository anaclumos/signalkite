import type { CuratedNewsletter } from '@prisma/client'

import {
  curatedNewsletters,
  curatedNewsletter,
  createCuratedNewsletter,
  updateCuratedNewsletter,
  deleteCuratedNewsletter,
} from './curatedNewsletters'
import type { StandardScenario } from './curatedNewsletters.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('curatedNewsletters', () => {
  scenario(
    'returns all curatedNewsletters',
    async (scenario: StandardScenario) => {
      const result = await curatedNewsletters()

      expect(result.length).toEqual(
        Object.keys(scenario.curatedNewsletter).length
      )
    }
  )

  scenario(
    'returns a single curatedNewsletter',
    async (scenario: StandardScenario) => {
      const result = await curatedNewsletter({
        id: scenario.curatedNewsletter.one.id,
      })

      expect(result).toEqual(scenario.curatedNewsletter.one)
    }
  )

  scenario(
    'creates a curatedNewsletter',
    async (scenario: StandardScenario) => {
      const result = await createCuratedNewsletter({
        input: {
          publicNewsletterHandle: 'String',
          newsletterName: 'String',
          userId: scenario.curatedNewsletter.two.userId,
          updatedAt: '2023-06-27T01:36:43.432Z',
        },
      })

      expect(result.publicNewsletterHandle).toEqual('String')
      expect(result.newsletterName).toEqual('String')
      expect(result.userId).toEqual(scenario.curatedNewsletter.two.userId)
      expect(result.updatedAt).toEqual(new Date('2023-06-27T01:36:43.432Z'))
    }
  )

  scenario(
    'updates a curatedNewsletter',
    async (scenario: StandardScenario) => {
      const original = (await curatedNewsletter({
        id: scenario.curatedNewsletter.one.id,
      })) as CuratedNewsletter
      const result = await updateCuratedNewsletter({
        id: original.id,
        input: { publicNewsletterHandle: 'String2' },
      })

      expect(result.publicNewsletterHandle).toEqual('String2')
    }
  )

  scenario(
    'deletes a curatedNewsletter',
    async (scenario: StandardScenario) => {
      const original = (await deleteCuratedNewsletter({
        id: scenario.curatedNewsletter.one.id,
      })) as CuratedNewsletter
      const result = await curatedNewsletter({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})

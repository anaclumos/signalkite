import type { Newsletter } from '@prisma/client'

import {
  newsletters,
  newsletter,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
} from './newsletters'
import type { StandardScenario } from './newsletters.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('newsletters', () => {
  scenario('returns all newsletters', async (scenario: StandardScenario) => {
    const result = await newsletters()

    expect(result.length).toEqual(Object.keys(scenario.newsletter).length)
  })

  scenario(
    'returns a single newsletter',
    async (scenario: StandardScenario) => {
      const result = await newsletter({ id: scenario.newsletter.one.id })

      expect(result).toEqual(scenario.newsletter.one)
    }
  )

  scenario('creates a newsletter', async () => {
    const result = await createNewsletter({
      input: {
        handle: 'String2821492',
        name: 'String',
        keyword: 'String',
        locale: 'String',
        region: 'String',
        userId: 'String',
        updatedAt: '2023-07-12T05:03:49.354Z',
      },
    })

    expect(result.handle).toEqual('String2821492')
    expect(result.name).toEqual('String')
    expect(result.keyword).toEqual('String')
    expect(result.locale).toEqual('String')
    expect(result.region).toEqual('String')
    expect(result.userId).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-07-12T05:03:49.354Z'))
  })

  scenario('updates a newsletter', async (scenario: StandardScenario) => {
    const original = (await newsletter({
      id: scenario.newsletter.one.id,
    })) as Newsletter
    const result = await updateNewsletter({
      id: original.id,
      input: { handle: 'String42070202' },
    })

    expect(result.handle).toEqual('String42070202')
  })

  scenario('deletes a newsletter', async (scenario: StandardScenario) => {
    const original = (await deleteNewsletter({
      id: scenario.newsletter.one.id,
    })) as Newsletter
    const result = await newsletter({ id: original.id })

    expect(result).toEqual(null)
  })
})

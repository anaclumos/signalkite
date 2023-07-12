import type { NewsletterContent } from '@prisma/client'

import {
  newsletterContents,
  newsletterContent,
  createNewsletterContent,
  updateNewsletterContent,
  deleteNewsletterContent,
} from './newsletterContents'
import type { StandardScenario } from './newsletterContents.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('newsletterContents', () => {
  scenario(
    'returns all newsletterContents',
    async (scenario: StandardScenario) => {
      const result = await newsletterContents()

      expect(result.length).toEqual(
        Object.keys(scenario.newsletterContent).length
      )
    }
  )

  scenario(
    'returns a single newsletterContent',
    async (scenario: StandardScenario) => {
      const result = await newsletterContent({
        id: scenario.newsletterContent.one.id,
      })

      expect(result).toEqual(scenario.newsletterContent.one)
    }
  )

  scenario('creates a newsletterContent', async () => {
    const result = await createNewsletterContent({
      input: {
        newsletterId: 'String',
        summaryLink: 'String',
        updatedAt: '2023-07-12T05:03:47.167Z',
      },
    })

    expect(result.newsletterId).toEqual('String')
    expect(result.summaryLink).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-07-12T05:03:47.167Z'))
  })

  scenario(
    'updates a newsletterContent',
    async (scenario: StandardScenario) => {
      const original = (await newsletterContent({
        id: scenario.newsletterContent.one.id,
      })) as NewsletterContent
      const result = await updateNewsletterContent({
        id: original.id,
        input: { newsletterId: 'String2' },
      })

      expect(result.newsletterId).toEqual('String2')
    }
  )

  scenario(
    'deletes a newsletterContent',
    async (scenario: StandardScenario) => {
      const original = (await deleteNewsletterContent({
        id: scenario.newsletterContent.one.id,
      })) as NewsletterContent
      const result = await newsletterContent({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})

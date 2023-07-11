import type { Content } from '@prisma/client'

import {
  contents,
  content,
  createContent,
  updateContent,
  deleteContent,
} from './contents'
import type { StandardScenario } from './contents.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('contents', () => {
  scenario('returns all contents', async (scenario: StandardScenario) => {
    const result = await contents()

    expect(result.length).toEqual(Object.keys(scenario.content).length)
  })

  scenario('returns a single content', async (scenario: StandardScenario) => {
    const result = await content({ id: scenario.content.one.id })

    expect(result).toEqual(scenario.content.one)
  })

  scenario('creates a content', async () => {
    const result = await createContent({
      input: { BCP47: 'String', updatedAt: '2023-07-10T22:12:21.034Z' },
    })

    expect(result.BCP47).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-07-10T22:12:21.034Z'))
  })

  scenario('updates a content', async (scenario: StandardScenario) => {
    const original = (await content({
      id: scenario.content.one.id,
    })) as Content
    const result = await updateContent({
      id: original.id,
      input: { BCP47: 'String2' },
    })

    expect(result.BCP47).toEqual('String2')
  })

  scenario('deletes a content', async (scenario: StandardScenario) => {
    const original = (await deleteContent({
      id: scenario.content.one.id,
    })) as Content
    const result = await content({ id: original.id })

    expect(result).toEqual(null)
  })
})

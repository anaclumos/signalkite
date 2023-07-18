import { LinguineList } from './Linguine'
import { fetchContent } from './tools/scrape'
import { summarizeWithAssumption } from './tools/summarize'
import { translateWithAssumption } from './tools/translate'
import { updateHN } from './tools/update-hn'
import { log } from './tools/util'

export default async () => {
  try {
    let stories = await updateHN()

    stories = await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 2000 * idx))
        const { originLink, commentLink } = story
        return await fetchContent(originLink, commentLink)
      })
    )

    stories = await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 2000 * idx))
        return await summarizeWithAssumption({
          originLink: story.originLink,
          summaryLocale: story.originLocale,
        })
      })
    )

    // translate contents
    await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 1000 * idx))
        LinguineList.map(async (linguine) => {
          await new Promise((resolve) => setTimeout(resolve, 1000 * idx))
          return await translateWithAssumption({
            originLink: story.originLink,
            summaryLocale: linguine,
          })
        })
      })
    )

    // get all newsletters

    // for each newsletter
    // if there is an active subscriber
    // get all summaries that are not older than 24 hours
  } catch (error) {
    log(error, 'error')
  }
}

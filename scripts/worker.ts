import { fetchContent } from './tools/scrape'
import { summarizeWithAssumption } from './tools/summarize'
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

    await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 2000 * idx))
        await summarizeWithAssumption({
          originLink: story.originLink,
          summaryLocale: story.originLocale,
        })
      })
    )

    // translate contents

    // get all newsletters

    // for each newsletter
    // if there is an active subscriber
    // get all summaries that are not older than 24 hours
    process.exit(0)
  } catch (error) {
    log(error, 'error')
  }
}

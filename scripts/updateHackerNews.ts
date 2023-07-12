import { db } from 'api/src/lib/db'

import { log } from './util'

export const updateHackerNews = async () => {
  let bestStories = await fetch(
    'https://hacker-news.firebaseio.com/v0/beststories.json'
  ).then((res) => res.json())

  bestStories = await Promise.all(
    bestStories.map(
      async (id) =>
        await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        ).then((res) => res.json())
    )
  )

  // sort by score
  bestStories.sort((a, b) => b.score - a.score)

  // cut down on the number of requests by only fetching the top 10
  bestStories = bestStories.slice(0, 10)

  try {
    await Promise.all(
      bestStories.map(async (story) => {
        const id = story.id
        const url =
          story.url != null && story.url !== ''
            ? story.url
            : `http://news.ycombinator.com/item?id=${id}`
        const result = await db.summary.upsert({
          where: {
            originLink_summaryLocale: {
              originLink: url,
              summaryLocale: 'en',
            },
          },
          create: {
            originLink: url,
            commentLink:
              `http://news.ycombinator.com/item?id=${id}` === url ||
              `https://news.ycombinator.com/item?id=${id}` === url
                ? ''
                : `https://news.ycombinator.com/item?id=${id}`,
            title: story.title,
            originLocale: 'en',
            commentLocale: 'en',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          update: {
            updatedAt: new Date(),
          },
        })
        log(`✅ Updated ${result.title}`, 'info')
      })
    )
  } catch (e) {
    log(e, 'error')
  }
}

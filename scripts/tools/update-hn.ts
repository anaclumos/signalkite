import { db } from 'api/src/lib/db'

import { HACKER_NEWS_PER_HOUR } from './config'
import { log } from './util'

/**
 * Update Hacker News
 * Returns the top 5 stories from Hacker News that are not older than 24 hours
 * @returns {Promise<[]>}
 * @example
 * const bestStories = await updateHN()
 * console.log(bestStories)
 */
export const updateHN = async () => {
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

  // get stories that are not older than 24 hours
  bestStories = bestStories.filter((story) => {
    const now = new Date()
    const storyDate = new Date(story.time * 1000)
    const diff = now.getTime() - storyDate.getTime()
    const diffHours = diff / (1000 * 3600)
    return diffHours < 24
  })
  bestStories.sort((a, b) => b.score - a.score)
  bestStories = bestStories.slice(0, HACKER_NEWS_PER_HOUR)

  try {
    bestStories = await Promise.all(
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
            summaryLocale: 'en',
            createdAt: new Date(),
            updatedAt: new Date(),
            points: story.score,
            commentCount: story.descendants,
          },
          update: {
            updatedAt: new Date(),
            points: story.score,
            commentCount: story.descendants,
          },
        })
        log(`✅ Updated\t${result.title}`, 'info')
        return result
      })
    )
    return bestStories
  } catch (e) {
    log(e, 'error')
  }
}

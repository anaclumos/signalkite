import { db } from 'api/src/lib/db'

import { log } from './util'

const main = async () => {
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

  // cut down on the number of requests by only fetching the top 10
  bestStories = bestStories.slice(0, 10)

  await Promise.all(
    bestStories.map(async (story) => {
      const id = story.id
      const url =
        story.url != null && story.url !== ''
          ? story.url
          : `http://news.ycombinator.com/item?id=${id}`
      const result = await db.linkSummary.upsert({
        where: { linkUrl: url },
        create: {
          linkUrl: url,
          commentUrl:
            // If the URL is the same as the HN URL, don't store it
            `http://news.ycombinator.com/item?id=${id}` === url ||
            `https://news.ycombinator.com/item?id=${id}` === url
              ? ''
              : `https://news.ycombinator.com/item?id=${id}`,
          title: story.title,
          createdAt: new Date(),
          updatedAt: new Date(),
          BCP47: 'en-US', // Hacker News is in English, initially
        },
        update: {
          title: story.title,
          linkUrl: url,
          updatedAt: new Date(),
        },
      })
      log(`✅ Updated ${result.linkUrl}`, 'info')
    })
  )
}

export default async () => {
  main()
    .then(async () => {
      await db.$disconnect()
      process.exit(0)
    })
    .catch(async (e) => {
      console.error(e)
      await db.$disconnect()
      process.exit(1)
    })
}

import { db } from 'api/src/lib/db'
import { logger } from 'api/src/lib/logger'

const main = async () => {
  const bestStories = await fetch(
    'https://hacker-news.firebaseio.com/v0/beststories.json'
  ).then((res) => res.json())

  await Promise.all(
    bestStories.map(async (id) => {
      const story = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      ).then((res) => res.json())
      const url =
        story.url != null && story.url !== ''
          ? story.url
          : `http://news.ycombinator.com/item?id=${id}`
      const result = await db.linkSummary.upsert({
        where: { linkUrl: url },
        create: {
          linkUrl: url,
          title: story.title,
          linkSummary: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          BCP47: 'en-US', // Hacker News is in English, initially
          body: '',
        },
        update: {
          title: story.title,
          linkUrl: url,
          updatedAt: new Date(),
          body: '',
        },
      })
      logger.info(`updateHackerNewsLinks: Updated ${result.linkUrl}`)
    })
  )
}

export default async () => {
  main()
    .then(async () => {
      await db.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await db.$disconnect()
      process.exit(1)
    })
}

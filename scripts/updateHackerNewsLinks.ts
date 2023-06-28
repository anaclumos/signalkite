import { db } from 'api/src/lib/db'

import { log } from './log'

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
          commentUrl:
            // If the URL is the same as the HN URL, don't store it
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

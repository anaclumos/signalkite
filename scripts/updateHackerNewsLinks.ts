import { db } from 'api/src/lib/db'

const main = async () => {
  const bestStories = await fetch(
    'https://hacker-news.firebaseio.com/v0/beststories.json'
  ).then((res) => res.json())

  await Promise.all(
    bestStories.map(async (id) => {
      const story = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      ).then((res) => res.json())
      const link = await db.linkSummary.upsert({
        where: { linkUrl: story.url },
        create: {
          title: story.title,
          linkUrl: story.url,
          linkSummary: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          BCP47: 'en-US', // Hacker News is in English
        },
        update: {
          title: story.title,
          linkUrl: story.url,
          updatedAt: new Date(),
        },
      })
      console.log(link)
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

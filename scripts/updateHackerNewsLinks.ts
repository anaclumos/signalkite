// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'

export default async () => {
  const bestStories = await fetch(
    'https://hacker-news.firebaseio.com/v0/beststories.json'
  ).then((res) => res.json())

  await Promise.all(
    bestStories.map(async (id) => {
      const story = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      ).then((res) => res.json())
      console.log(story)

      db.linkSummary.upsert({
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
    })
  )
}

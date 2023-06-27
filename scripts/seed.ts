import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const data: Prisma.UserCreateArgs['data'][] = [
      {
        username: 'anaclumos',
        email: 'hey@cho.sh',
        displayName: 'Sunghyun Cho',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        timezone: 'US/Pacific',
      },
    ]
    Promise.all(
      data.map(async (data: Prisma.UserCreateArgs['data']) => {
        const record = await db.user.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Cannot Populate User')
    console.error(error)
  }

  // insert curated newsletter
  try {
    const data: Prisma.CuratedNewsletterCreateArgs['data'][] = [
      {
        newsletterName: 'Hacker News',
        description: 'The (Venture) Capital of Startups',
        publicNewsletterHandle: 'hackernews',
        createdAt: new Date(),
        updatedAt: new Date(),
        User: {
          connect: {
            username: 'anaclumos',
          },
        },
      },
    ]
    Promise.all(
      data.map(async (data: Prisma.CuratedNewsletterCreateArgs['data']) => {
        const record = await db.curatedNewsletter.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Cannot Populate Curated Newsletter')
    console.error(error)
  }
}

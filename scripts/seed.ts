import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const data: Prisma.UserCreateArgs['data'][] = [
      {
        handle: 'anaclumos',
        email: 'hey@cho.sh',
        name: 'Sunghyun Cho',
        hashedPassword: '',
        salt: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        timezone: 'US/Pacific',
      },
    ]
    Promise.all(
      data.map(async (data: Prisma.UserCreateArgs['data']) => {
        await db.user.create({ data })
      })
    )
    console.log('Successfully Populated User')
  } catch (error) {
    console.warn('Cannot Populate User')
  }


  try {

    // get user's id
    const user = await db.user.findUnique({
      where: {
        handle: 'anaclumos',
      },
    })

    const data: Prisma.NewsletterCreateArgs['data'][] = [
      {
        name: 'Hacker News',
        handle: 'hn',
        keyword : '',
        locale: 'en',
        region: 'US',
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        userId: user?.id ?? '',
      },
    ]
    Promise.all(
      data.map(async (data: Prisma.NewsletterCreateArgs['data']) => {
        await db.newsletter.create({ data })
      })
    )
    console.log('Successfully Populated Newsletter')
  }
  catch (error) {
    console.warn('Cannot Populate Newsletter')
  }
}

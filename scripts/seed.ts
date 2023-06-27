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
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    Promise.all(
      data.map(async (data: Prisma.UserCreateArgs['data']) => {
        const record = await db.user.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}

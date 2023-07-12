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
}

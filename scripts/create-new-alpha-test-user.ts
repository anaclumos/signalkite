// To access your database
// Append api/* to import from api and web/* to import from web
import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

import { log } from './tools/util'

export default async () => {
  const data: Prisma.UserCreateArgs['data'][] = [
    {
      handle: '',
      email: '',
      name: '',
      hashedPassword: '',
      salt: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  ]
  await Promise.all(
    data.map(async (data: Prisma.UserCreateArgs['data']) => {
      await db.user.create({ data })
    })
  )
  log('Successfully Populated User', 'info')

  const user = await db.user.findUnique({
    where: {
      handle: '',
    },
  })

  const newsletter = await db.newsletter.findUnique({
    where: {
      handle: '',
    },
  })

  await db.subscription.create({
    data: {
      newsletterId: newsletter.id,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      frequency: 'DAILY',
      time: '6', // UTC
      length: 'SHORT',
    },
  })
}

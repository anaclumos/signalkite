import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

import { createHN } from './tools/all-hn'
import { log } from './tools/util'

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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    ]
    await Promise.all(
      data.map(async (data: Prisma.UserCreateArgs['data']) => {
        await db.user.create({ data })
      })
    )
    log('Successfully Populated User', 'info')
  } catch (error) {
    log(`Cannot Populate User ${error}`, 'error')
  }

  try {
    // get user's id
    const user = await db.user.findUnique({
      where: {
        handle: 'anaclumos',
      },
    })

    const data = createHN(user)

    await Promise.all(
      data.map(async (data: Prisma.NewsletterCreateArgs['data'], idx) => {
        await new Promise((resolve) => setTimeout(resolve, 500 * idx))
        await db.newsletter.create({ data })
      })
    )

    // Subscribe to hn-ko
    const newsletter = await db.newsletter.findUnique({
      where: {
        handle: 'hn-ko',
      },
    })

    await db.subscription.create({
      data: {
        newsletterId: newsletter.id,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        frequency: 'DAILY',
        time: 'HOURLY',
        length: 'SHORT',
      },
    })
    log('Successfully Populated Newsletter', 'info')
  } catch (error) {
    log(`Cannot Populate Newsletter ${error}`, 'error')
  }
}

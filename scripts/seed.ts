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
    Promise.all(
      data.map(async (data: Prisma.UserCreateArgs['data']) => {
        await db.user.create({ data })
      })
    )
    log('Successfully Populated User', 'info')
  } catch (error) {
    log(`Cannot Populate User ${error}`, 'error')
    // }

    try {
      // get user's id
      const user = await db.user.findUnique({
        where: {
          handle: 'anaclumos',
        },
      })

      const data = createHN(user)

      Promise.all(
        data.map(async (data: Prisma.NewsletterCreateArgs['data']) => {
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
          frequency: 'WEEKLY',
          time: '09:00',
          length: '100',
        },
      })

      log('Successfully Populated Newsletter', 'info')
    } catch (error) {
      log(`Cannot Populate Newsletter ${error}`, 'error')
    }
  }
}

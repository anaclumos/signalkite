import { db } from 'api/src/lib/db'
import { Resend } from 'resend'

import seed from './seed'
import { transformIntoHTML } from './tools/email'
import { fetchContent } from './tools/scrape'
import { summarizeWithAssumption } from './tools/summarize'
import { getCurrentZuluDay, getCurrentZuluHour } from './tools/time'
import { translateWithAssumption } from './tools/translate'
import { updateHN } from './tools/update-hn'
import { log } from './tools/util'
export default async () => {
  const users = await db.user.findMany()
  if (users.length === 0) {
    await seed()
  }

  try {
    // get all subscriptions that match today and hour
    const today = getCurrentZuluDay()
    const hour = getCurrentZuluHour()
    log(`Today: ${today}, Hour: ${hour}`, 'info')
    const subscriptions = await db.subscription.findMany({
      where: {
        AND: [
          { OR: [{ frequency: 'DAILY' }, { frequency: today }] },
          { OR: [{ time: hour }, { time: 'HOURLY' }] },
          { deletedAt: null },
        ],
      },
    })
    log(`Subscriptions: ${JSON.stringify(subscriptions)}`, 'info')

    // if no subscriptions, return
    if (subscriptions.length === 0) {
      log('No Subscriptions', 'info')
      return
    }

    // get all stories from hn
    let stories = await updateHN()

    stories = await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 2000 * idx))
        const { originLink, commentLink } = story
        return await fetchContent(originLink, commentLink)
      })
    )

    stories = await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 2000 * idx))
        return await summarizeWithAssumption({
          originLink: story.originLink,
          summaryLocale: story.originLocale,
        })
      })
    )

    // get active locales from subscriptions
    const activeLocalesPromises = subscriptions.map(async (subscription) => {
      const newsletter = await db.newsletter.findUnique({
        where: {
          id: subscription.newsletterId,
        },
        select: {
          locale: true,
        },
      })
      return newsletter.locale
    })

    const activeLocales = await Promise.all(activeLocalesPromises)

    // translate contents
    const lingualStoryMap = await Promise.all(
      stories.map(async (story, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 1000 * idx))
        return activeLocales.map(async (locale) => {
          await new Promise((resolve) => setTimeout(resolve, 1000 * idx))
          return await translateWithAssumption({
            originLink: story.originLink,
            summaryLocale: locale,
          })
        })
      })
    )

    // resolve all promises
    const lingualStoryMapResolved = await Promise.all(
      lingualStoryMap.map(async (story) => {
        return await Promise.all(story)
      })
    )

    // reorder lingualStoryMap with activeLocales as keys
    const lingualStories = activeLocales.map((locale, idx) => {
      return {
        locale,
        stories: lingualStoryMapResolved.map((story) => story[idx]),
      }
    })

    const resend = new Resend(process.env.RESEND_API_KEY)

    await Promise.all(
      lingualStories.map(async (lingualStory) => {
        const { locale } = lingualStory
        const newsletter = await db.newsletter.findUnique({
          where: {
            handle: `hn-${locale}`,
          },
        })
        const subscribersToSend = subscriptions.filter(
          (subscription) => subscription.newsletterId === newsletter.id
        )
        await Promise.all(
          subscribersToSend.map(async (subscriber) => {
            const { userId } = subscriber
            const user = await db.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                email: true,
              },
            })

            await resend.emails.send({
              from: 'heimdall <heimdall@newsletters.cho.sh>',
              to: [user.email],
              subject: lingualStories.filter(
                (lingualStory) => lingualStory.locale === locale
              )[0].stories[0].title,
              html: transformIntoHTML(lingualStory.stories, newsletter.name),
            })
            log(`Email sent to ${user.email}`, 'info')
          })
        )
      })
    )
  } catch (error) {
    log(error, 'error')
    process.exit(1)
  }
  process.exit(0)
}

import { db } from 'api/src/lib/db'
import { updateHackerNews } from './updateHackerNews'

export default async () => {
  // for all non-deleted newsletter and has at least one non-deleted subscriber

  const newsletters = await db.newsletter.findMany({
    where: {
      deleted: false,
    },
  })

  const newsletterIds = newsletters.map((newsletter) => newsletter.id)

  const currentHourInZulu = new Date().getUTCHours()

  const subscribers = await db.subscription.findMany({
    where: {
      deleted: false,
      newsletterId: {
        in: newsletterIds,
      },
      time: {
        equals: String(currentHourInZulu),
      },
    },
  })

  const newslettersToBeSent = newsletters.filter((newsletter) => {
    const newsletterSubscribers = subscribers.filter(
      (subscriber) => subscriber.newsletterId === newsletter.id
    )
    return newsletterSubscribers.length > 0
  })

  // It is guaranteed that HN will exist
  await updateHackerNews()
  for (const newsletter of newslettersToBeSent) {
    // update newsletter
  }

  // generate summary & contents

  // send email

}

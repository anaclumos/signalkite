// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    await db.$executeRaw`TRUNCATE TABLE "Newsletter" CASCADE;`
    await db.$executeRaw`TRUNCATE TABLE "Subscription" CASCADE;`
    await db.$executeRaw`TRUNCATE TABLE "Summary" CASCADE;`
    await db.$executeRaw`TRUNCATE TABLE "User" CASCADE;`
    await db.$executeRaw`TRUNCATE TABLE "NewsletterContent" CASCADE;`
    await db.$executeRaw`TRUNCATE TABLE "UserCredential" CASCADE;`
  } catch (error) {
    console.log(error)
  }
}
